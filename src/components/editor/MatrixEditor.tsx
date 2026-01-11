import { useRef, useCallback, useState, useMemo } from 'react'
import { Undo2, Redo2, Trash2 } from 'lucide-react'
import type { PixelUpdate, OnionSkinMode } from '../../stores/editorStore'
import { useEditorState } from '../../stores/editorStore'
import type { OnionSkinLayer } from '../ui/Matrix'
import { Matrix } from '../ui/Matrix'
import { emptyFrame } from '../ui/Matrix'

interface MatrixEditorProps {
  size?: number
  gap?: number
}

export function MatrixEditor({ size = 28, gap = 4 }: MatrixEditorProps) {
  const editorState = useEditorState()
  const {
    setPixel,
    setPixelsBatch,
    saveHistory,
    undo,
    redo,
    clearFrame,
    setCurrentFrameIndex,
    frames,
    currentFrameIndex,
    gridSize,
    palette,
    tool,
    brushBrightness,
    gridVisibility,
    glow,
    bloomIntensity,
    fadeIntensity,
    transitionSpeed,
    fps,
    loop,
    isPlaying,
    isPaused,
    onionSkinEnabled,
    onionSkinMode,
    onionSkinPreviousOpacity,
    onionSkinNextOpacity,
  } = editorState

  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastCell, setLastCell] = useState<{ row: number; col: number } | null>(
    null,
  )

  const { rows, cols } = gridSize

  // Computed values - calculated locally to avoid infinite re-renders
  const currentFrame = useMemo(
    () => frames[currentFrameIndex] || emptyFrame(rows, cols),
    [frames, currentFrameIndex, rows, cols],
  )

  const onionSkinLayers = useMemo<Array<{
    frame: number[][]
    opacity: number
    type: 'previous' | 'next'
  }>>(() => {
    if (!onionSkinEnabled) return []

    const layers: Array<{
      frame: number[][]
      opacity: number
      type: 'previous' | 'next'
    }> = []

    // Previous frame
    if (onionSkinMode === 'previous' || onionSkinMode === 'both') {
      if (currentFrameIndex > 0) {
        layers.push({
          frame: frames[currentFrameIndex - 1],
          opacity: onionSkinPreviousOpacity / 100,
          type: 'previous',
        })
      }
    }

    // Next frame
    if (onionSkinMode === 'next' || onionSkinMode === 'both') {
      if (currentFrameIndex < frames.length - 1) {
        layers.push({
          frame: frames[currentFrameIndex + 1],
          opacity: onionSkinNextOpacity / 100,
          type: 'next',
        })
      }
    }

    return layers
  }, [
    onionSkinEnabled,
    onionSkinMode,
    currentFrameIndex,
    frames,
    onionSkinPreviousOpacity,
    onionSkinNextOpacity,
  ])

  // Get cell from mouse position
  const getCellFromEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!containerRef.current) return null

      const rect = containerRef.current.getBoundingClientRect()
      let clientX: number, clientY: number

      if ('touches' in e) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const x = clientX - rect.left
      const y = clientY - rect.top

      const col = Math.floor(x / (size + gap))
      const row = Math.floor(y / (size + gap))

      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        return { row, col }
      }
      return null
    },
    [size, gap, rows, cols],
  )

  // Apply tool to cell
  const applyTool = useCallback(
    (row: number, col: number) => {
      switch (tool) {
        case 'brush':
          setPixel(row, col, brushBrightness)
          break
        case 'eraser':
          setPixel(row, col, 0)
          break
        case 'fill':
          const targetValue = currentFrame[row][col]
          const fillValue = brushBrightness
          if (targetValue === fillValue) return

          const visited = new Set<string>()
          const stack = [[row, col]]
          const updates: PixelUpdate[] = []

          while (stack.length > 0) {
            const [r, c] = stack.pop()!
            const key = `${r},${c}`

            if (visited.has(key)) continue
            if (r < 0 || r >= rows || c < 0 || c >= cols) continue
            if (currentFrame[r][c] !== targetValue) continue

            visited.add(key)
            updates.push({ row: r, col: c, value: fillValue })

            stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
          }

          setPixelsBatch(updates)
          break
      }
    },
    [tool, brushBrightness, currentFrame, setPixel, setPixelsBatch, rows, cols],
  )

  // Mouse/touch handlers
  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (isPlaying) return // Don't allow drawing during playback
      e.preventDefault()
      saveHistory()
      setIsDrawing(true)
      const cell = getCellFromEvent(e)
      if (cell) {
        setLastCell(cell)
        applyTool(cell.row, cell.col)
      }
    },
    [getCellFromEvent, applyTool, saveHistory, isPlaying],
  )

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return
      if (isPlaying) return
      e.preventDefault()

      const cell = getCellFromEvent(e)
      if (cell && (cell.row !== lastCell?.row || cell.col !== lastCell?.col)) {
        setLastCell(cell)
        applyTool(cell.row, cell.col)
      }
    },
    [isDrawing, getCellFromEvent, applyTool, lastCell, isPlaying],
  )

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false)
    setLastCell(null)
  }, [])

  // Memoize grid dimensions
  const gridWidth = useMemo(() => cols * (size + gap) - gap, [cols, size, gap])
  const gridHeight = useMemo(() => rows * (size + gap) - gap, [rows, size, gap])

  // Pre-compute cell styles for different states
  const cellStyles = useMemo(() => {
    const offHidden = {
      backgroundColor: 'transparent' as const,
      border: 'none' as const,
      opacity: 0,
    }

    const offProminent = {
      backgroundColor: '#e0ddd5',
      border: '1px solid #d4d0c8',
      opacity: 1,
    }

    const offNormal = {
      backgroundColor: '#f0efe9',
      border: '1px solid #e8e6e0',
      opacity: 0.8,
    }

    const getOffStyle = () => {
      if (gridVisibility === 'hidden') return offHidden
      if (gridVisibility === 'prominent') return offProminent
      return offNormal
    }

    return {
      getOffStyle,
      getOnStyle: (value: number) => {
        const glowColor = palette.on + '40'
        return {
          backgroundColor: palette.on,
          opacity: value,
          boxShadow:
            glow && value > 0.3
              ? `0 0 ${size / 4}px ${palette.on}, 0 0 ${size / 2}px ${glowColor}`
              : undefined,
          border: 'none',
        }
      },
      offStyle: getOffStyle(),
    }
  }, [palette, gridVisibility, glow, size])

  const getCellStyle = (value: number) => {
    if (value <= 0.05) {
      return cellStyles.offStyle
    }
    return cellStyles.getOnStyle(value)
  }

  // Calculate Matrix component size to match the editable grid
  const matrixSize = size // Same pixel size
  const matrixGap = gap   // Same gap

  return (
    <div className="relative">
      {/* PCB Board Background */}
      <div className="absolute inset-0 -m-8 rounded-lg border border-[#e0ddd5] bg-white shadow-sm">
        {/* PCB Circuit Traces */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="trace-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#0066cc" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#0066cc" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0066cc" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Horizontal traces */}
          <line
            x1="0"
            y1="20%"
            x2="30%"
            y2="20%"
            stroke="url(#trace-gradient)"
            strokeWidth="1"
          />
          <line
            x1="70%"
            y1="20%"
            x2="100%"
            y2="20%"
            stroke="url(#trace-gradient)"
            strokeWidth="1"
          />
          <circle
            cx="30%"
            cy="20%"
            r="3"
            fill="#f8f7f4"
            stroke="#0066cc"
            strokeWidth="1"
            opacity="0.5"
          />
          <circle
            cx="70%"
            cy="20%"
            r="3"
            fill="#f8f7f4"
            stroke="#0066cc"
            strokeWidth="1"
            opacity="0.5"
          />

          <line
            x1="0"
            y1="80%"
            x2="40%"
            y2="80%"
            stroke="url(#trace-gradient)"
            strokeWidth="1"
          />
          <line
            x1="60%"
            y1="80%"
            x2="100%"
            y2="80%"
            stroke="url(#trace-gradient)"
            strokeWidth="1"
          />
          <circle
            cx="40%"
            cy="80%"
            r="3"
            fill="#f8f7f4"
            stroke="#0066cc"
            strokeWidth="1"
            opacity="0.5"
          />
          <circle
            cx="60%"
            cy="80%"
            r="3"
            fill="#f8f7f4"
            stroke="#0066cc"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Vertical traces */}
          <line
            x1="15%"
            y1="0"
            x2="15%"
            y2="25%"
            stroke="url(#trace-gradient)"
            strokeWidth="1"
          />
          <line
            x1="15%"
            y1="75%"
            x2="15%"
            y2="100%"
            stroke="url(#trace-gradient)"
            strokeWidth="1"
          />
          <circle
            cx="15%"
            cy="25%"
            r="3"
            fill="#f8f7f4"
            stroke="#0066cc"
            strokeWidth="1"
            opacity="0.5"
          />
          <circle
            cx="15%"
            cy="75%"
            r="3"
            fill="#f8f7f4"
            stroke="#0066cc"
            strokeWidth="1"
            opacity="0.5"
          />

          <line
            x1="85%"
            y1="0"
            x2="85%"
            y2="30%"
            stroke="url(#trace-gradient)"
            strokeWidth="1"
          />
          <line
            x1="85%"
            y1="70%"
            x2="85%"
            y2="100%"
            stroke="url(#trace-gradient)"
            strokeWidth="1"
          />
          <circle
            cx="85%"
            cy="30%"
            r="3"
            fill="#f8f7f4"
            stroke="#0066cc"
            strokeWidth="1"
            opacity="0.5"
          />
          <circle
            cx="85%"
            cy="70%"
            r="3"
            fill="#f8f7f4"
            stroke="#0066cc"
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>

        {/* Mounting holes in corners */}
        <div className="absolute top-4 left-4 h-4 w-4 rounded-full border-2 border-[#e0ddd5] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]" />
        <div className="absolute top-4 right-4 h-4 w-4 rounded-full border-2 border-[#e0ddd5] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]" />
        <div className="absolute bottom-4 left-4 h-4 w-4 rounded-full border-2 border-[#e0ddd5] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]" />
        <div className="absolute bottom-4 right-4 h-4 w-4 rounded-full border-2 border-[#e0ddd5] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]" />
      </div>

      {/* LED Matrix Container */}
      <div
        className="relative z-10"
        style={{ width: gridWidth, height: gridHeight }}
      >
        {/* Action Buttons - Undo/Redo/Clear */}
        <div className="absolute -top-12 left-0 flex gap-2">
          <button
            onClick={undo}
            className="h-8 w-8 flex items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#0066cc]/50 hover:text-[#0066cc] transition-all shadow-sm"
            title="Undo"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={redo}
            className="h-8 w-8 flex items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#0066cc]/50 hover:text-[#0066cc] transition-all shadow-sm"
            title="Redo"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={clearFrame}
            className="h-8 w-8 flex items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#dd3355] hover:border-[#dd3355] hover:bg-[#fff5f5] transition-all shadow-sm"
            title="Clear"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Playback mode - use Matrix component with animation */}
        {isPlaying ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Matrix
              rows={rows}
              cols={cols}
              frames={frames}
              fps={fps}
              loop={loop}
              paused={isPaused}
              autoplay={true}
              size={matrixSize}
              gap={matrixGap}
              palette={palette}
              glow={glow}
              bloomIntensity={bloomIntensity}
              fadeIntensity={fadeIntensity}
              transitionSpeed={transitionSpeed}
              onFrame={(index) => setCurrentFrameIndex(index)}
              onionSkinLayers={onionSkinLayers}
            />
            {/* Playing indicator */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00aa55] animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#00aa55]">
                Playing
              </span>
            </div>
          </div>
        ) : (
          /* Edit mode - interactive grid */
          <div
            ref={containerRef}
            className="cursor-crosshair select-none touch-none"
            style={{ width: gridWidth, height: gridHeight }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          >
            <div
              className="relative"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, ${size}px)`,
                gridTemplateRows: `repeat(${rows}, ${size}px)`,
                gap: `${gap}px`,
              }}
            >
              {currentFrame.map((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="transition-all duration-75 ease-out"
                    style={{
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      ...getCellStyle(value),
                    }}
                  />
                )),
              )}
            </div>

            {/* Onion Skin Overlay */}
            {onionSkinLayers.length > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${cols}, ${size}px)`,
                  gridTemplateRows: `repeat(${rows}, ${size}px)`,
                  gap: `${gap}px`,
                }}
              >
                {onionSkinLayers.map((layer, layerIndex) =>
                  layer.frame.map((row, rowIndex) =>
                    row.map((value, colIndex) => {
                      if (value <= 0.01) return null

                      const opacity = layer.opacity * value
                      const layerClass = layer.type === 'previous' ? 'onion-skin-previous' : 'onion-skin-next'

                      return (
                        <div
                          key={`onion-${layer.type}-${layerIndex}-${rowIndex}-${colIndex}`}
                          className={`transition-all duration-75 ease-out ${layerClass}`}
                          style={{
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            backgroundColor: palette.on,
                            opacity: opacity * 0.6,
                            transform: 'scale(0.9)',
                            filter: layer.type === 'previous'
                              ? 'grayscale(0.5) sepia(0.15)'
                              : 'hue-rotate(160deg) grayscale(0.3) saturate(1.2)',
                          }}
                        />
                      )
                    })
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tech Overlay - Corner Brackets */}
      <div className="absolute -top-6 -left-6 h-8 w-8 border-l-2 border-t-2 border-[#0066cc]/20 rounded-tl-lg" />
      <div className="absolute -top-6 -right-6 h-8 w-8 border-r-2 border-t-2 border-[#0066cc]/20 rounded-tr-lg" />
      <div className="absolute -bottom-6 -left-6 h-8 w-8 border-l-2 border-b-2 border-[#0066cc]/20 rounded-bl-lg" />
      <div className="absolute -bottom-6 -right-6 h-8 w-8 border-r-2 border-b-2 border-[#0066cc]/20 rounded-br-lg" />

      {/* Grid Dimensions Label */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="h-px w-6 bg-[#0066cc]/15" />
        <span className="text-[10px] font-mono text-[#8a8a8a] uppercase tracking-widest">
          {cols}x{rows} MATRIX
        </span>
        <div className="h-px w-6 bg-[#0066cc]/15" />
      </div>
    </div>
  )
}
