import { useRef, useCallback, useState } from 'react'
import type { EditorStore } from '../../stores/editorStore'

interface MatrixEditorProps {
  store: EditorStore
  size?: number
  gap?: number
}

export function MatrixEditor({ store, size = 28, gap = 4 }: MatrixEditorProps) {
  const { state, currentFrame, setPixel, saveHistory } = store
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastCell, setLastCell] = useState<{ row: number; col: number } | null>(
    null,
  )

  const { rows, cols } = state.gridSize

  // Calculate grid dimensions
  const gridWidth = cols * (size + gap) - gap
  const gridHeight = rows * (size + gap) - gap

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
      const { tool, brushBrightness } = state

      switch (tool) {
        case 'brush':
          setPixel(row, col, brushBrightness)
          break
        case 'eraser':
          setPixel(row, col, 0)
          break
        case 'fill':
          // Simple flood fill
          const targetValue = currentFrame[row][col]
          const fillValue = brushBrightness
          if (targetValue === fillValue) return

          const visited = new Set<string>()
          const stack = [[row, col]]

          while (stack.length > 0) {
            const [r, c] = stack.pop()!
            const key = `${r},${c}`

            if (visited.has(key)) continue
            if (r < 0 || r >= rows || c < 0 || c >= cols) continue
            if (currentFrame[r][c] !== targetValue) continue

            visited.add(key)
            setPixel(r, c, fillValue)

            stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
          }
          break
      }
    },
    [state, currentFrame, setPixel, rows, cols],
  )

  // Mouse/touch handlers
  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      saveHistory()
      setIsDrawing(true)
      const cell = getCellFromEvent(e)
      if (cell) {
        setLastCell(cell)
        applyTool(cell.row, cell.col)
      }
    },
    [getCellFromEvent, applyTool, saveHistory],
  )

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return
      e.preventDefault()

      const cell = getCellFromEvent(e)
      if (cell && (cell.row !== lastCell?.row || cell.col !== lastCell?.col)) {
        setLastCell(cell)
        applyTool(cell.row, cell.col)
      }
    },
    [isDrawing, getCellFromEvent, applyTool, lastCell],
  )

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false)
    setLastCell(null)
  }, [])

  // Get cell color based on value
  const getCellStyle = (value: number) => {
    // Light Mode Support:
    // When off (value ~0), use visibility settings
    // When on, use palette color
    if (value <= 0.05) {
      // Empty cell styling based on gridVisibility
      if (state.gridVisibility === 'hidden') {
        return {
          backgroundColor: 'transparent',
          border: '1px solid transparent',
          opacity: 0,
        }
      }

      if (state.gridVisibility === 'prominent') {
        return {
          backgroundColor: '#f4f4f5', // zinc-100
          border: '2px solid #a1a1aa', // zinc-400 - thicker, darker border
          opacity: 1,
        }
      }

      // Normal mode (default)
      return {
        backgroundColor: state.palette.off,
        border: '1px solid #e4e4e7', // zinc-200
        opacity: 1,
      }
    }

    // Lit cell styling
    return {
      backgroundColor: state.palette.on,
      opacity: value,
      boxShadow:
        state.glow && value > 0.5
          ? `0 0 ${size / 2}px ${state.palette.on}`
          : undefined,
      border: `1px solid ${state.palette.on}`,
    }
  }

  return (
    <div className="relative flex items-center justify-center rounded border border-zinc-200 bg-white p-8 shadow-sm">
      {/* Background Dot Grid for reference */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 transition-opacity duration-300"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: state.gridVisibility === 'hidden' ? 0 : 0.1,
        }}
      />

      <div
        ref={containerRef}
        className="relative cursor-crosshair select-none touch-none"
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
                className="transition-all duration-75"
                style={{
                  width: size,
                  height: size,
                  borderRadius: '2px', // Slight rounding, almost square
                  ...getCellStyle(value),
                }}
              />
            )),
          )}
        </div>
      </div>

      {/* Grid Dimensions Label */}
      <div className="absolute top-2 right-3 text-[10px] font-mono text-zinc-400">
        {cols}x{rows}
      </div>
    </div>
  )
}
