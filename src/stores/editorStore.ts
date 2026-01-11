import { useState, useCallback, useMemo } from 'react'
import type { Frame } from '../components/ui/Matrix'
import { generateTweenFrames, deepCloneFrame } from '../utils/animation'

export type TweenEasing = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'smoothstep'
export type OnionSkinMode = 'previous' | 'next' | 'both'

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

// Type for batch pixel updates
export type PixelUpdate = { row: number; col: number; value: number }

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
  isPaused: boolean
  loop: boolean
  glow: boolean
  bloomIntensity: number // 0-100
  transitionSpeed: 'slow' | 'normal' | 'fast'
  fadeIntensity: number // 0-100
  gridVisibility: 'hidden' | 'normal' | 'prominent'
  history: Frame[][]
  historyIndex: number
  // Onion skin state
  onionSkinEnabled: boolean
  onionSkinPreviousOpacity: number // 0-100
  onionSkinNextOpacity: number // 0-100
  onionSkinMode: OnionSkinMode
  // Frame selection for tweening
  selectedFrameIndices: number[]
  // Tween easing
  tweenEasing: TweenEasing
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
  isPaused: false,
  loop: true,
  glow: true,
  bloomIntensity: 30,
  transitionSpeed: 'normal',
  fadeIntensity: 50,
  gridVisibility: 'normal',
  history: [],
  historyIndex: -1,
  // Onion skin defaults
  onionSkinEnabled: false,
  onionSkinPreviousOpacity: 30,
  onionSkinNextOpacity: 15,
  onionSkinMode: 'both',
  // Frame selection defaults
  selectedFrameIndices: [],
  // Tween easing default
  tweenEasing: 'smoothstep',
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

  // Set multiple pixels in a single batch operation (for flood fill, etc.)
  const setPixelsBatch = useCallback((updates: PixelUpdate[]) => {
    setState((prev) => {
      const frame = cloneFrame(prev.frames[prev.currentFrameIndex])
      for (const { row, col, value } of updates) {
        if (row >= 0 && row < frame.length && col >= 0 && col < frame[0].length) {
          frame[row][col] = value
        }
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

  // Toggle paused
  const togglePaused = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
  }, [])

  // Set paused
  const setPaused = useCallback((paused: boolean) => {
    setState((prev) => ({ ...prev, isPaused: paused }))
  }, [])

  // Toggle loop
  const toggleLoop = useCallback(() => {
    setState((prev) => ({ ...prev, loop: !prev.loop }))
  }, [])

  // Toggle glow
  const toggleGlow = useCallback(() => {
    setState((prev) => ({ ...prev, glow: !prev.glow }))
  }, [])

  // Set bloom intensity (0-100)
  const setBloomIntensity = useCallback((intensity: number) => {
    setState((prev) => ({
      ...prev,
      bloomIntensity: Math.max(0, Math.min(100, intensity)),
    }))
  }, [])

  // Set transition speed
  const setTransitionSpeed = useCallback(
    (speed: 'slow' | 'normal' | 'fast') => {
      setState((prev) => ({ ...prev, transitionSpeed: speed }))
    },
    [],
  )

  // Set fade intensity (0-100)
  const setFadeIntensity = useCallback((intensity: number) => {
    setState((prev) => ({
      ...prev,
      fadeIntensity: Math.max(0, Math.min(100, intensity)),
    }))
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

  // ===== Onion Skin Actions =====

  const setOnionSkinEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, onionSkinEnabled: enabled }))
  }, [])

  const setOnionSkinOpacity = useCallback((previous: number, next: number) => {
    setState((prev) => ({
      ...prev,
      onionSkinPreviousOpacity: Math.max(0, Math.min(100, previous)),
      onionSkinNextOpacity: Math.max(0, Math.min(100, next)),
    }))
  }, [])

  const setOnionSkinMode = useCallback((mode: OnionSkinMode) => {
    setState((prev) => ({ ...prev, onionSkinMode: mode }))
  }, [])

  const toggleOnionSkin = useCallback(() => {
    setState((prev) => ({ ...prev, onionSkinEnabled: !prev.onionSkinEnabled }))
  }, [])

  // ===== Frame Selection Actions =====

  const setSelectedFrameIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, selectedFrameIndices: [index] }))
  }, [])

  const toggleFrameSelection = useCallback((index: number) => {
    setState((prev) => {
      const isSelected = prev.selectedFrameIndices.includes(index)
      if (isSelected) {
        return {
          ...prev,
          selectedFrameIndices: prev.selectedFrameIndices.filter((i) => i !== index),
        }
      }
      return {
        ...prev,
        selectedFrameIndices: [...prev.selectedFrameIndices, index],
      }
    })
  }, [])

  const selectFrameRange = useCallback((fromIndex: number, toIndex: number) => {
    const start = Math.min(fromIndex, toIndex)
    const end = Math.max(fromIndex, toIndex)
    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i)
    setState((prev) => ({ ...prev, selectedFrameIndices: range }))
  }, [])

  const clearFrameSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selectedFrameIndices: [] }))
  }, [])

  // ===== Tween Actions =====

  const setTweenEasing = useCallback((easing: TweenEasing) => {
    setState((prev) => ({ ...prev, tweenEasing: easing }))
  }, [])

  const generateTween = useCallback(
    (fromIndex: number, toIndex: number, count: number) => {
      saveHistory()
      setState((prev) => {
        if (fromIndex >= toIndex || count <= 0) return prev

        const fromFrame = prev.frames[fromIndex]
        const toFrame = prev.frames[toIndex]

        if (!fromFrame || !toFrame) return prev

        const { tweenedFrames, insertIndex } = generateTweenFrames(
          prev.frames,
          fromIndex,
          toIndex,
          Math.min(count, 20), // Cap at 20 frames for performance
          prev.tweenEasing
        )

        // Insert tween frames (note: toIndex will shift after insertion)
        const newFrames = [...prev.frames]
        // Remove frames between from and to (exclusive)
        const framesToRemove = toIndex - fromIndex - 1
        newFrames.splice(fromIndex + 1, framesToRemove, ...tweenedFrames)

        return {
          ...prev,
          frames: newFrames,
          selectedFrameIndices: [], // Clear selection after tweening
        }
      })
    },
    [saveHistory]
  )

  // ===== Drag & Drop Actions =====

  const reorderFrames = useCallback(
    (fromIndex: number, toIndex: number) => {
      saveHistory()
      setState((prev) => {
        if (fromIndex === toIndex) return prev

        const frames = [...prev.frames]
        const [movedFrame] = frames.splice(fromIndex, 1)
        frames.splice(toIndex, 0, movedFrame)

        // Update current frame index
        let newCurrentIndex = prev.currentFrameIndex
        if (prev.currentFrameIndex === fromIndex) {
          newCurrentIndex = toIndex
        } else if (fromIndex < prev.currentFrameIndex && toIndex >= prev.currentFrameIndex) {
          newCurrentIndex = prev.currentFrameIndex - 1
        } else if (fromIndex > prev.currentFrameIndex && toIndex <= prev.currentFrameIndex) {
          newCurrentIndex = prev.currentFrameIndex + 1
        }

        return {
          ...prev,
          frames,
          currentFrameIndex: newCurrentIndex,
          selectedFrameIndices: [],
        }
      })
    },
    [saveHistory]
  )

  // Get onion skin layers for current frame
  const onionSkinLayers = useMemo(() => {
    if (!state.onionSkinEnabled) return []

    const layers: Array<{ frame: Frame; opacity: number; type: 'previous' | 'next' }> = []
    const { currentFrameIndex, frames, onionSkinMode, onionSkinPreviousOpacity, onionSkinNextOpacity } =
      state

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
  }, [state.onionSkinEnabled, state.currentFrameIndex, state.frames, state.onionSkinMode, state.onionSkinPreviousOpacity, state.onionSkinNextOpacity])

  // Get current frame
  const currentFrame = state.frames[state.currentFrameIndex]

  // Memoize the return object to prevent unnecessary re-renders in consuming components
  // This ensures components only re-render when values they actually use change
  return useMemo(
    () => ({
      state,
      currentFrame,
      onionSkinLayers,
      // Actions
      setPixel,
      setPixelsBatch,
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
      togglePaused,
      setPaused,
      toggleLoop,
      toggleGlow,
      setBloomIntensity,
      setTransitionSpeed,
      setFadeIntensity,
      setGridVisibility,
      loadPattern,
      loadFrames,
      saveHistory,
      undo,
      redo,
      // Onion skin actions
      setOnionSkinEnabled,
      setOnionSkinOpacity,
      setOnionSkinMode,
      toggleOnionSkin,
      // Frame selection actions
      setSelectedFrameIndex,
      toggleFrameSelection,
      selectFrameRange,
      clearFrameSelection,
      // Tween actions
      setTweenEasing,
      generateTween,
      // Drag & drop actions
      reorderFrames,
    }),
    [
      state,
      currentFrame,
      onionSkinLayers,
      setPixel,
      setPixelsBatch,
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
      togglePaused,
      setPaused,
      toggleLoop,
      toggleGlow,
      setBloomIntensity,
      setTransitionSpeed,
      setFadeIntensity,
      setGridVisibility,
      loadPattern,
      loadFrames,
      saveHistory,
      undo,
      redo,
      setOnionSkinEnabled,
      setOnionSkinOpacity,
      setOnionSkinMode,
      toggleOnionSkin,
      setSelectedFrameIndex,
      toggleFrameSelection,
      selectFrameRange,
      clearFrameSelection,
      setTweenEasing,
      generateTween,
      reorderFrames,
    ],
  )
}

export type EditorStore = ReturnType<typeof useEditorStore>
