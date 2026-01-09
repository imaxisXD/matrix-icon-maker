import { useState, useCallback } from 'react'
import type { Frame } from '../components/ui/Matrix'

// Create empty frame
function emptyFrame(rows: number, cols: number): Frame {
  return Array.from({ length: rows }, () => Array(cols).fill(0))
}

// Deep clone a frame
function cloneFrame(frame: Frame): Frame {
  return frame.map((row) => [...row])
}

// Deep clone frames array
function cloneFrames(frames: Frame[]): Frame[] {
  return frames.map(cloneFrame)
}

export type Tool = 'brush' | 'eraser' | 'fill' | 'line'

export interface EditorState {
  frames: Frame[]
  currentFrameIndex: number
  gridSize: { rows: number; cols: number }
  palette: { on: string; off: string }
  tool: Tool
  brushBrightness: number
  fps: number
  isPlaying: boolean
  glow: boolean
  gridVisibility: 'hidden' | 'normal' | 'prominent'
  history: Frame[][]
  historyIndex: number
}

const DEFAULT_STATE: EditorState = {
  frames: [emptyFrame(9, 9)],
  currentFrameIndex: 0,
  gridSize: { rows: 9, cols: 9 },
  palette: { on: 'hsl(200, 100%, 50%)', off: 'hsl(200, 20%, 20%)' },
  tool: 'brush',
  brushBrightness: 1,
  fps: 12,
  isPlaying: false,
  glow: true,
  gridVisibility: 'normal',
  history: [],
  historyIndex: -1,
}

export function useEditorStore(initialState: Partial<EditorState> = {}) {
  const [state, setState] = useState<EditorState>({
    ...DEFAULT_STATE,
    ...initialState,
  })

  // Save to history
  const saveHistory = useCallback(() => {
    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1)
      newHistory.push(cloneFrames(prev.frames))
      return {
        ...prev,
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: Math.min(newHistory.length - 1, 49),
      }
    })
  }, [])

  // Undo
  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex < 0) return prev
      const frames = cloneFrames(prev.history[prev.historyIndex])
      return {
        ...prev,
        frames,
        historyIndex: prev.historyIndex - 1,
      }
    })
  }, [])

  // Redo
  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev
      const frames = cloneFrames(prev.history[prev.historyIndex + 1])
      return {
        ...prev,
        frames,
        historyIndex: prev.historyIndex + 1,
      }
    })
  }, [])

  // Set pixel value
  const setPixel = useCallback((row: number, col: number, value: number) => {
    setState((prev) => {
      const frame = cloneFrame(prev.frames[prev.currentFrameIndex])
      if (row >= 0 && row < frame.length && col >= 0 && col < frame[0].length) {
        frame[row][col] = value
      }
      const frames = [...prev.frames]
      frames[prev.currentFrameIndex] = frame
      return { ...prev, frames }
    })
  }, [])

  // Clear current frame
  const clearFrame = useCallback(() => {
    saveHistory()
    setState((prev) => {
      const frames = [...prev.frames]
      frames[prev.currentFrameIndex] = emptyFrame(
        prev.gridSize.rows,
        prev.gridSize.cols,
      )
      return { ...prev, frames }
    })
  }, [saveHistory])

  // Fill entire frame
  const fillFrame = useCallback(
    (value: number) => {
      saveHistory()
      setState((prev) => {
        const frames = [...prev.frames]
        frames[prev.currentFrameIndex] = Array.from(
          { length: prev.gridSize.rows },
          () => Array(prev.gridSize.cols).fill(value),
        )
        return { ...prev, frames }
      })
    },
    [saveHistory],
  )

  // Add new frame
  const addFrame = useCallback(() => {
    setState((prev) => {
      const newFrame = emptyFrame(prev.gridSize.rows, prev.gridSize.cols)
      const frames = [
        ...prev.frames.slice(0, prev.currentFrameIndex + 1),
        newFrame,
        ...prev.frames.slice(prev.currentFrameIndex + 1),
      ]
      return {
        ...prev,
        frames,
        currentFrameIndex: prev.currentFrameIndex + 1,
      }
    })
  }, [])

  // Duplicate current frame
  const duplicateFrame = useCallback(() => {
    setState((prev) => {
      const duplicate = cloneFrame(prev.frames[prev.currentFrameIndex])
      const frames = [
        ...prev.frames.slice(0, prev.currentFrameIndex + 1),
        duplicate,
        ...prev.frames.slice(prev.currentFrameIndex + 1),
      ]
      return {
        ...prev,
        frames,
        currentFrameIndex: prev.currentFrameIndex + 1,
      }
    })
  }, [])

  // Delete current frame
  const deleteFrame = useCallback(() => {
    setState((prev) => {
      if (prev.frames.length <= 1) {
        // Don't delete last frame, just clear it
        const frames = [emptyFrame(prev.gridSize.rows, prev.gridSize.cols)]
        return { ...prev, frames, currentFrameIndex: 0 }
      }
      const frames = prev.frames.filter((_, i) => i !== prev.currentFrameIndex)
      const newIndex = Math.min(prev.currentFrameIndex, frames.length - 1)
      return { ...prev, frames, currentFrameIndex: newIndex }
    })
  }, [])

  // Set current frame index
  const setCurrentFrame = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      currentFrameIndex: Math.max(0, Math.min(index, prev.frames.length - 1)),
    }))
  }, [])

  // Set grid size
  const setGridSize = useCallback((rows: number, cols: number) => {
    setState((prev) => {
      // Resize all frames
      const frames = prev.frames.map((frame) => {
        const newFrame: Frame = []
        for (let r = 0; r < rows; r++) {
          newFrame.push([])
          for (let c = 0; c < cols; c++) {
            newFrame[r][c] = frame[r]?.[c] ?? 0
          }
        }
        return newFrame
      })
      return { ...prev, frames, gridSize: { rows, cols } }
    })
  }, [])

  // Set palette
  const setPalette = useCallback((on: string, off: string) => {
    setState((prev) => ({ ...prev, palette: { on, off } }))
  }, [])

  // Set tool
  const setTool = useCallback((tool: Tool) => {
    setState((prev) => ({ ...prev, tool }))
  }, [])

  // Set brush brightness
  const setBrushBrightness = useCallback((brightness: number) => {
    setState((prev) => ({ ...prev, brushBrightness: brightness }))
  }, [])

  // Set FPS
  const setFps = useCallback((fps: number) => {
    setState((prev) => ({ ...prev, fps }))
  }, [])

  // Toggle playing
  const togglePlaying = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
  }, [])

  // Toggle glow
  const toggleGlow = useCallback(() => {
    setState((prev) => ({ ...prev, glow: !prev.glow }))
  }, [])

  // Set grid visibility
  const setGridVisibility = useCallback(
    (visibility: 'hidden' | 'normal' | 'prominent') => {
      setState((prev) => ({ ...prev, gridVisibility: visibility }))
    },
    [],
  )

  // Load pattern (single frame)
  const loadPattern = useCallback(
    (pattern: Frame) => {
      saveHistory()
      const rows = pattern.length
      const cols = pattern[0]?.length ?? 9
      setState((prev) => ({
        ...prev,
        frames: [cloneFrame(pattern)],
        currentFrameIndex: 0,
        gridSize: { rows, cols },
      }))
    },
    [saveHistory],
  )

  // Load frames (animation)
  const loadFrames = useCallback(
    (frames: Frame[]) => {
      saveHistory()
      if (frames.length === 0) return
      const rows = frames[0].length
      const cols = frames[0][0]?.length ?? 9
      setState((prev) => ({
        ...prev,
        frames: cloneFrames(frames),
        currentFrameIndex: 0,
        gridSize: { rows, cols },
      }))
    },
    [saveHistory],
  )

  // Get current frame
  const currentFrame = state.frames[state.currentFrameIndex]

  return {
    state,
    currentFrame,
    // Actions
    setPixel,
    clearFrame,
    fillFrame,
    addFrame,
    duplicateFrame,
    deleteFrame,
    setCurrentFrame,
    setGridSize,
    setPalette,
    setTool,
    setBrushBrightness,
    setFps,
    togglePlaying,
    toggleGlow,
    setGridVisibility,
    loadPattern,
    loadFrames,
    saveHistory,
    undo,
    redo,
  }
}

export type EditorStore = ReturnType<typeof useEditorStore>
