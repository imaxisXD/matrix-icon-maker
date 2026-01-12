import { useState, useCallback, useMemo, useEffect, memo } from 'react'
import {
  Play,
  Pause,
  Plus,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Film,
  Layers,
  Sparkles,
  GripVertical,
  X,
  HelpCircle,
  Keyboard,
} from 'lucide-react'
import type { OnionSkinMode, TweenEasing } from '../../stores/editorStore'
import { useAnimationState } from '../../stores/editorStore'
import { Matrix, type Frame } from '../ui/Matrix'

interface AnimationTimelineProps {
  // No props needed - uses hooks directly
}

interface DragState {
  fromIndex: number | null
  dropIndex: number | null
}

const SHORTCUTS = [
  { key: 'Space', action: 'Play / Pause animation' },
  { key: 'O', action: 'Toggle onion skin' },
  { key: '[ / ]', action: 'Adjust onion skin opacity' },
  { key: 'T', action: 'Open tween dialog (when 2 frames selected)' },
  { key: 'Ctrl + Click', action: 'Multi-select frames' },
  { key: 'Shift + Click', action: 'Range select frames' },
  { key: 'Esc', action: 'Clear selection' },
  { key: 'Delete', action: 'Delete selected frame' },
  { key: 'Ctrl + Z', action: 'Undo' },
  { key: 'Ctrl + Shift + Z', action: 'Redo' },
  { key: '← / →', action: 'Navigate frames' },
  { key: 'N', action: 'Add new frame' },
  { key: 'D', action: 'Duplicate current frame' },
] as const

// Memoized frame card component for performance
interface FrameCardProps {
  frame: Frame
  index: number
  isSelected: boolean
  isCurrent: boolean
  isDragging: boolean
  isDropTarget: boolean
  isPlaying: boolean
  gridSize: { rows: number; cols: number }
  palette: { on: string; off: string }
  dragFromIndex: number | null
  onClick: (index: number, event: React.MouseEvent) => void
  onDragStart: (index: number) => void
  onDragOver: (index: number, event: React.DragEvent) => void
  onDrop: (index: number, event: React.DragEvent) => void
  onDragEnd: () => void
}

const FrameCard = memo(function FrameCard({
  frame,
  index,
  isSelected,
  isCurrent,
  isDragging,
  isDropTarget,
  isPlaying,
  gridSize,
  palette,
  dragFromIndex,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: FrameCardProps) {
  return (
    <div className="relative">
      {/* Drop indicator */}
      {isDropTarget && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0066cc] -translate-x-1/2 z-10"
          style={{
            left:
              dragFromIndex !== null && dragFromIndex < index
                ? '-1px'
                : 'calc(100% - 1px)',
          }}
        />
      )}

      <button
        draggable={!isPlaying}
        onDragStart={() => onDragStart(index)}
        onDragOver={(e) => onDragOver(index, e)}
        onDrop={(e) => onDrop(index, e)}
        onDragEnd={onDragEnd}
        onClick={(e) => onClick(index, e)}
        className={`group relative flex flex-shrink-0 flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
          isDragging ? 'opacity-50 scale-105 shadow-lg' : ''
        } ${
          isCurrent
            ? 'border-[#0066cc] bg-[#e6f0ff] shadow-sm'
            : isSelected
              ? 'border-[#aa55cc] bg-[#f5e6ff] shadow-sm'
              : 'border-[#e0ddd5] bg-white hover:border-[#d4d0c8]'
        }`}
        style={{ cursor: isPlaying ? 'default' : 'grab' }}
        title={`Frame ${index + 1}${isCurrent ? ' (current)' : ''}`}
      >
        {/* Drag handle */}
        {!isPlaying && (
          <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-30 transition-opacity">
            <GripVertical className="h-3 w-3 text-[#8a8a8a]" />
          </div>
        )}

        {/* Frame number badge */}
        <div
          className={`absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded text-[9px] font-bold border ${
            isCurrent
              ? 'border-[#0066cc] bg-[#0066cc] text-white'
              : isSelected
                ? 'border-[#aa55cc] bg-[#aa55cc] text-white'
                : 'border-[#e0ddd5] bg-white text-[#8a8a8a]'
          }`}
        >
          {index + 1}
        </div>

        {/* Selection indicator */}
        {isSelected && !isCurrent && (
          <div className="absolute -bottom-1 -right-1 h-4 w-4 flex items-center justify-center rounded bg-[#aa55cc] text-white">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
        )}

        <Matrix
          rows={gridSize.rows}
          cols={gridSize.cols}
          pattern={frame}
          size={5}
          gap={1}
          palette={palette}
          glow={false}
        />
      </button>
    </div>
  )
})

export function AnimationTimeline(_props: AnimationTimelineProps) {
  // Use animation state hook - includes all necessary state
  const {
    frames,
    currentFrameIndex,
    fps,
    isPlaying,
    loop,
    togglePlaying,
    setFps,
    setCurrentFrameIndex,
    addFrame,
    duplicateFrame,
    deleteFrame,
    undo,
    redo,
    // Onion skin
    onionSkinEnabled,
    onionSkinPreviousOpacity,
    onionSkinNextOpacity,
    onionSkinMode,
    toggleOnionSkin,
    setOnionSkinOpacity,
    setOnionSkinMode,
    // Frame selection
    selectedFrameIndices,
    setSelectedFrameIndex,
    toggleFrameSelection,
    selectFrameRange,
    clearFrameSelection,
    // Tween
    tweenEasing,
    generateTween,
    setTweenEasing,
    // Drag & drop
    reorderFrames,
    // Display
    gridSize,
    palette,
  } = useAnimationState()

  const [showOnionControls, setShowOnionControls] = useState(false)
  const [showTweenDialog, setShowTweenDialog] = useState(false)
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [tweenFrameCount, setTweenFrameCount] = useState(5)
  const [dragState, setDragState] = useState<DragState>({
    fromIndex: null,
    dropIndex: null,
  })

  // Computed values
  const hasSelection = selectedFrameIndices.length > 0
  const hasTwoSelected = selectedFrameIndices.length === 2
  const selectionRange = useMemo(() => {
    if (selectedFrameIndices.length < 2) return null
    const sorted = [...selectedFrameIndices].sort((a, b) => a - b)
    return { from: sorted[0], to: sorted[sorted.length - 1] }
  }, [selectedFrameIndices])

  // Frame click handler with selection support
  const handleFrameClick = useCallback(
    (index: number, event: React.MouseEvent) => {
      if (isPlaying) return

      if (event.shiftKey && selectedFrameIndices.length === 1) {
        // Range select
        selectFrameRange(selectedFrameIndices[0], index)
      } else if (event.ctrlKey || event.metaKey) {
        // Toggle selection
        toggleFrameSelection(index)
      } else {
        // Normal click - select single and navigate
        setSelectedFrameIndex(index)
        setCurrentFrameIndex(index)
      }
    },
    [
      isPlaying,
      selectedFrameIndices,
      selectFrameRange,
      toggleFrameSelection,
      setSelectedFrameIndex,
      setCurrentFrameIndex,
    ],
  )

  // Drag start handler
  const handleDragStart = useCallback(
    (index: number) => {
      if (isPlaying) return
      setDragState({ fromIndex: index, dropIndex: null })
    },
    [isPlaying],
  )

  // Drag over handler
  const handleDragOver = useCallback(
    (index: number, event: React.DragEvent) => {
      event.preventDefault()
      if (isPlaying || dragState.fromIndex === null) return
      setDragState((prev) => ({ ...prev, dropIndex: index }))
    },
    [isPlaying, dragState.fromIndex],
  )

  // Drop handler
  const handleDrop = useCallback(
    (index: number, event: React.DragEvent) => {
      event.preventDefault()
      if (dragState.fromIndex === null || dragState.fromIndex === index) {
        setDragState({ fromIndex: null, dropIndex: null })
        return
      }
      reorderFrames(dragState.fromIndex, index)
      setDragState({ fromIndex: null, dropIndex: null })
    },
    [dragState.fromIndex, reorderFrames],
  )

  // Drag end handler
  const handleDragEnd = useCallback(() => {
    setDragState({ fromIndex: null, dropIndex: null })
  }, [])

  // Tween generation handler
  const handleGenerateTween = useCallback(() => {
    if (!selectionRange) return
    generateTween(selectionRange.from, selectionRange.to, tweenFrameCount)
    setShowTweenDialog(false)
    clearFrameSelection()
  }, [selectionRange, tweenFrameCount, generateTween, clearFrameSelection])

  // Clear selection handler
  const handleClearSelection = useCallback(() => {
    clearFrameSelection()
  }, [clearFrameSelection])

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Ignore if modifier keys are pressed (except for specific shortcuts)
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault()
          if (e.shiftKey) {
            redo()
          } else {
            undo()
          }
        }
        return
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlaying()
          break
        case 'o':
        case 'O':
          e.preventDefault()
          toggleOnionSkin()
          break
        case 't':
        case 'T':
          if (hasTwoSelected) {
            e.preventDefault()
            setShowTweenDialog(true)
          }
          break
        case 'Escape':
          e.preventDefault()
          clearFrameSelection()
          setShowOnionControls(false)
          setShowHelpDialog(false)
          break
        case 'Delete':
        case 'Backspace':
          if (hasSelection && selectedFrameIndices.length === 1) {
            e.preventDefault()
            setCurrentFrameIndex(selectedFrameIndices[0])
            deleteFrame()
            clearFrameSelection()
          } else {
            e.preventDefault()
            deleteFrame()
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (currentFrameIndex > 0) {
            setCurrentFrameIndex(currentFrameIndex - 1)
            setSelectedFrameIndex(currentFrameIndex - 1)
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (currentFrameIndex < frames.length - 1) {
            setCurrentFrameIndex(currentFrameIndex + 1)
            setSelectedFrameIndex(currentFrameIndex + 1)
          }
          break
        case 'n':
        case 'N':
          e.preventDefault()
          addFrame()
          break
        case 'd':
        case 'D':
          e.preventDefault()
          duplicateFrame()
          break
        case '[':
          e.preventDefault()
          setOnionSkinOpacity(
            Math.max(0, onionSkinPreviousOpacity - 10),
            onionSkinNextOpacity,
          )
          break
        case ']':
          e.preventDefault()
          setOnionSkinOpacity(
            Math.min(100, onionSkinPreviousOpacity + 10),
            onionSkinNextOpacity,
          )
          break
        case '?':
          e.preventDefault()
          setShowHelpDialog((prev) => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    isPlaying,
    currentFrameIndex,
    frames.length,
    hasTwoSelected,
    hasSelection,
    selectedFrameIndices,
    onionSkinPreviousOpacity,
    onionSkinNextOpacity,
    togglePlaying,
    toggleOnionSkin,
    clearFrameSelection,
    deleteFrame,
    undo,
    redo,
    setCurrentFrameIndex,
    setSelectedFrameIndex,
    addFrame,
    duplicateFrame,
    setOnionSkinOpacity,
  ])

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Header */}
      <div className="flex items-center justify-between border-b border-[#e0ddd5] pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlaying}
            className={`relative flex items-center gap-2 rounded border px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
              isPlaying
                ? 'border-[#0066cc] bg-[#e6f0ff] text-[#0066cc]'
                : 'border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#0066cc]/50 hover:text-[#0066cc]'
            }`}
            title="Play/Pause (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Play
              </>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-3 border-l border-[#e0ddd5] pl-4">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8a8a8a]">
              Speed
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="30"
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="h-1.5 w-20 appearance-none rounded-full bg-[#f0efe9] accent-[#0066cc]"
                style={{
                  background:
                    'linear-gradient(to right, #0066cc 0%, #3388dd 100%)',
                  WebkitAppearance: 'none',
                }}
              />
              <span className="w-10 font-mono text-[10px] text-[#0066cc]">
                {fps} FPS
              </span>
            </div>
          </div>

          {/* Onion Skin Toggle */}
          <div className="relative flex items-center gap-3 border-l border-[#e0ddd5] pl-4">
            <button
              onClick={() => {
                toggleOnionSkin()
                if (!onionSkinEnabled) {
                  setShowOnionControls(true)
                }
              }}
              className={`flex items-center gap-2 rounded border px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                onionSkinEnabled
                  ? 'border-[#0066cc] bg-[#e6f0ff] text-[#0066cc]'
                  : 'border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#0066cc]/50 hover:text-[#0066cc]'
              }`}
              title="Toggle Onion Skin (O)"
            >
              <Layers className="h-3.5 w-3.5" />
              Onion
            </button>

            {/* Onion Skin Controls Popover */}
            {showOnionControls && onionSkinEnabled && (
              <div className="absolute top-full left-0 mt-2 z-20 rounded-lg border border-[#e0ddd5] bg-white p-4 shadow-lg">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8a8a8a]">
                      Previous
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={onionSkinPreviousOpacity}
                      onChange={(e) =>
                        setOnionSkinOpacity(
                          Number(e.target.value),
                          onionSkinNextOpacity,
                        )
                      }
                      className="h-1 w-24 appearance-none rounded-full bg-[#f0efe9] accent-[#0066cc]"
                    />
                    <span className="w-8 font-mono text-[10px] text-[#0066cc]">
                      {onionSkinPreviousOpacity}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8a8a8a]">
                      Next
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={onionSkinNextOpacity}
                      onChange={(e) =>
                        setOnionSkinOpacity(
                          onionSkinPreviousOpacity,
                          Number(e.target.value),
                        )
                      }
                      className="h-1 w-24 appearance-none rounded-full bg-[#f0efe9] accent-[#0066cc]"
                    />
                    <span className="w-8 font-mono text-[10px] text-[#0066cc]">
                      {onionSkinNextOpacity}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8a8a8a]">
                      Mode:
                    </span>
                    <div className="flex gap-1">
                      {(['previous', 'next', 'both'] as OnionSkinMode[]).map(
                        (mode) => (
                          <button
                            key={mode}
                            onClick={() => setOnionSkinMode(mode)}
                            className={`px-2 py-1 text-[9px] font-bold uppercase rounded transition-all ${
                              onionSkinMode === mode
                                ? 'bg-[#0066cc] text-white'
                                : 'bg-[#f0efe9] text-[#8a8a8a] hover:bg-[#e0ddd5]'
                            }`}
                          >
                            {mode === 'both' ? 'Both' : mode}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tween Button */}
          {hasTwoSelected && (
            <div className="flex items-center gap-3 border-l border-[#e0ddd5] pl-4">
              <button
                onClick={() => setShowTweenDialog(true)}
                className="flex items-center gap-2 rounded border border-[#e0ddd5] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] transition-all hover:border-[#aa55cc]/50 hover:text-[#aa55cc]"
                title="Generate tween frames (T)"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Tween
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {/* Help Button */}
          <button
            onClick={() => setShowHelpDialog(true)}
            className="flex h-9 w-9 items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#8a8a8a] transition-all hover:border-[#0066cc]/50 hover:text-[#0066cc] hover:shadow-sm"
            title="Keyboard shortcuts (?)"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Clear Selection Button */}
          {hasSelection && (
            <button
              onClick={handleClearSelection}
              className="flex h-9 items-center gap-1.5 rounded border border-[#e0ddd5] bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] transition-all hover:border-[#8a8a8a] hover:text-[#2a2a2a]"
              title="Clear selection (Esc)"
            >
              <X className="h-3.5 w-3.5" />
              Clear ({selectedFrameIndices.length})
            </button>
          )}

          <button
            onClick={addFrame}
            className="flex h-9 w-9 items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#8a8a8a] transition-all hover:border-[#00aa55]/50 hover:text-[#00aa55] hover:shadow-sm"
            title="Add Frame (N)"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={duplicateFrame}
            className="flex h-9 w-9 items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#8a8a8a] transition-all hover:border-[#0066cc]/50 hover:text-[#0066cc] hover:shadow-sm"
            title="Duplicate Frame (D)"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={deleteFrame}
            className="flex h-9 w-9 items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#8a8a8a] transition-all hover:border-[#dd3355]/50 hover:text-[#dd3355] hover:shadow-sm"
            title="Delete Frame"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Help Dialog */}
      {showHelpDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={() => setShowHelpDialog(false)}
        >
          <div
            className="rounded-lg border border-[#e0ddd5] bg-white p-6 shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <Keyboard className="h-5 w-5 text-[#0066cc]" />
              <h3 className="text-sm font-bold text-[#2a2a2a]">
                Keyboard Shortcuts
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {SHORTCUTS.map((shortcut) => (
                <div key={shortcut.key} className="flex items-start gap-2">
                  <kbd className="px-2 py-0.5 text-[9px] font-mono bg-[#f0efe9] border border-[#e0ddd5] rounded text-[#0066cc] whitespace-nowrap">
                    {shortcut.key}
                  </kbd>
                  <span className="text-[10px] text-[#8a8a8a]">
                    {shortcut.action}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowHelpDialog(false)}
                className="px-4 py-2 bg-[#0066cc] text-white text-[10px] font-bold uppercase tracking-wider rounded hover:bg-[#0055bb] transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tween Dialog */}
      {showTweenDialog && selectionRange && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={() => setShowTweenDialog(false)}
        >
          <div
            className="rounded-lg border border-[#e0ddd5] bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-[#2a2a2a] mb-4">
              Generate Tween Frames
            </h3>
            <p className="text-[10px] text-[#8a8a8a] mb-4">
              Generate {tweenFrameCount} frame{tweenFrameCount !== 1 ? 's' : ''}{' '}
              between frame {selectionRange.from + 1} and frame{' '}
              {selectionRange.to + 1}
            </p>

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] w-24">
                  Frames:
                </span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={tweenFrameCount}
                  onChange={(e) =>
                    setTweenFrameCount(
                      Math.min(20, Math.max(1, Number(e.target.value) || 1)),
                    )
                  }
                  className="w-20 rounded border border-[#e0ddd5] px-3 py-2 text-[10px] font-mono"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] w-24">
                  Easing:
                </span>
                <div className="flex gap-1">
                  {(
                    [
                      'linear',
                      'easeIn',
                      'easeOut',
                      'easeInOut',
                      'smoothstep',
                    ] as TweenEasing[]
                  ).map((easing) => (
                    <button
                      key={easing}
                      onClick={() => setTweenEasing(easing)}
                      className={`px-3 py-2 text-[10px] font-bold uppercase rounded transition-all ${
                        tweenEasing === easing
                          ? 'bg-[#aa55cc] text-white'
                          : 'bg-[#f0efe9] text-[#8a8a8a] hover:bg-[#e0ddd5]'
                      }`}
                    >
                      {easing === 'smoothstep' ? 'Smooth' : easing}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowTweenDialog(false)}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] hover:text-[#2a2a2a] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateTween}
                className="px-4 py-2 bg-[#aa55cc] text-white text-[10px] font-bold uppercase tracking-wider rounded hover:bg-[#9944bb] transition-all"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Track */}
      <div className="flex items-center gap-3 p-2">
        <button
          onClick={() => setCurrentFrameIndex(currentFrameIndex - 1)}
          disabled={currentFrameIndex === 0}
          className="flex h-20 w-10 items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#8a8a8a] disabled:opacity-30 hover:border-[#0066cc]/30 hover:text-[#0066cc] transition-all"
          title="Previous frame (←)"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex flex-1 gap-3 overflow-x-auto py-2 scrollbar-thin">
          {frames.map((frame, index) => {
            const isSelected = selectedFrameIndices.includes(index)
            const isCurrent = index === currentFrameIndex
            const isDragging = dragState.fromIndex === index
            const isDropTarget = dragState.dropIndex === index

            return (
              <FrameCard
                key={index}
                frame={frame}
                index={index}
                isSelected={isSelected}
                isCurrent={isCurrent}
                isDragging={isDragging}
                isDropTarget={isDropTarget}
                isPlaying={isPlaying}
                gridSize={gridSize}
                palette={palette}
                dragFromIndex={dragState.fromIndex}
                onClick={handleFrameClick}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              />
            )
          })}
        </div>

        <button
          onClick={() => setCurrentFrameIndex(currentFrameIndex + 1)}
          disabled={currentFrameIndex === frames.length - 1}
          className="flex h-20 w-10 items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#8a8a8a] disabled:opacity-30 hover:border-[#0066cc]/30 hover:text-[#0066cc] transition-all"
          title="Next frame (→)"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Timeline Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#e0ddd5]">
        <div className="flex items-center gap-4 text-[#8a8a8a]">
          <div className="flex items-center gap-2">
            <Film className="h-3.5 w-3.5" />
            <span className="text-[9px] uppercase tracking-wider">
              {frames.length} Frame{frames.length !== 1 ? 's' : ''}
            </span>
          </div>
          {hasSelection && (
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#aa55cc]">
              <span>{selectedFrameIndices.length} selected</span>
              {selectionRange && (
                <span className="text-[#8a8a8a]">
                  ({selectionRange.from + 1} - {selectionRange.to + 1})
                </span>
              )}
            </div>
          )}
        </div>
        <div className="text-[9px] font-mono text-[#8a8a8a]">
          Current:{' '}
          <span className="text-[#0066cc]">
            {String(currentFrameIndex + 1).padStart(2, '0')}
          </span>{' '}
          / {String(frames.length).padStart(2, '0')}
        </div>
      </div>
    </div>
  )
}
