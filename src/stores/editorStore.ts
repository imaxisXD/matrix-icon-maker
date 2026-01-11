import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { Frame } from '../components/ui/Matrix'
import { generateTweenFrames, deepCloneFrame } from '../utils/animation'

export type TweenEasing =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'smoothstep'
export type OnionSkinMode = 'previous' | 'next' | 'both'
export type Tool = 'brush' | 'eraser' | 'fill' | 'line'
export type PixelUpdate = { row: number; col: number; value: number }

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

// ============ STATE SLICES ============

// Animation State (changes frequently during playback)
interface AnimationState {
  frames: Frame[]
  currentFrameIndex: number
  fps: number
  isPlaying: boolean
  isPaused: boolean
  loop: boolean
}

// Editing State (changes while drawing)
interface EditingState {
  gridSize: { rows: number; cols: number }
  palette: { on: string; off: string }
  tool: Tool
  brushBrightness: number
  glow: boolean
  bloomIntensity: number
  fadeIntensity: number
  transitionSpeed: 'slow' | 'normal' | 'fast'
  gridVisibility: 'hidden' | 'normal' | 'prominent'
}

// Onion Skin State
interface OnionSkinState {
  onionSkinEnabled: boolean
  onionSkinPreviousOpacity: number
  onionSkinNextOpacity: number
  onionSkinMode: OnionSkinMode
}

// Selection State (for tweening)
interface SelectionState {
  selectedFrameIndices: number[]
  tweenEasing: TweenEasing
}

// History State
interface HistoryState {
  history: Frame[][]
  historyIndex: number
}

// ============ DEFAULT STATE ============

const DEFAULT_ANIMATION: AnimationState = {
  frames: [emptyFrame(9, 9)],
  currentFrameIndex: 0,
  fps: 12,
  isPlaying: false,
  isPaused: false,
  loop: true,
}

const DEFAULT_EDITING: EditingState = {
  gridSize: { rows: 9, cols: 9 },
  palette: { on: 'hsl(200, 100%, 50%)', off: 'hsl(200, 20%, 20%)' },
  tool: 'brush',
  brushBrightness: 1,
  glow: true,
  bloomIntensity: 30,
  fadeIntensity: 50,
  transitionSpeed: 'normal',
  gridVisibility: 'normal',
}

const DEFAULT_ONION_SKIN: OnionSkinState = {
  onionSkinEnabled: false,
  onionSkinPreviousOpacity: 30,
  onionSkinNextOpacity: 15,
  onionSkinMode: 'both',
}

const DEFAULT_SELECTION: SelectionState = {
  selectedFrameIndices: [],
  tweenEasing: 'smoothstep',
}

const DEFAULT_HISTORY: HistoryState = {
  history: [],
  historyIndex: -1,
}

// ============ ACTIONS ============

interface AnimationActions {
  setFrames: (frames: Frame[]) => void
  setCurrentFrameIndex: (index: number) => void
  setFps: (fps: number) => void
  togglePlaying: () => void
  setPaused: (paused: boolean) => void
  toggleLoop: () => void
  addFrame: () => void
  duplicateFrame: () => void
  deleteFrame: () => void
  loadFrames: (frames: Frame[]) => void
}

interface EditingActions {
  setGridSize: (size: { rows: number; cols: number }) => void
  setPalette: (palette: { on: string; off: string }) => void
  setTool: (tool: Tool) => void
  setBrushBrightness: (brightness: number) => void
  toggleGlow: () => void
  setBloomIntensity: (intensity: number) => void
  setTransitionSpeed: (speed: 'slow' | 'normal' | 'fast') => void
  setFadeIntensity: (intensity: number) => void
  setGridVisibility: (visibility: 'hidden' | 'normal' | 'prominent') => void
  setPixel: (row: number, col: number, value: number) => void
  setPixelsBatch: (updates: PixelUpdate[]) => void
  clearFrame: () => void
  fillFrame: () => void
  loadPattern: (pattern: Frame) => void
}

interface OnionSkinActions {
  setOnionSkinEnabled: (enabled: boolean) => void
  setOnionSkinOpacity: (previous: number, next: number) => void
  setOnionSkinMode: (mode: OnionSkinMode) => void
  toggleOnionSkin: () => void
}

interface SelectionActions {
  setSelectedFrameIndex: (index: number) => void
  toggleFrameSelection: (index: number) => void
  selectFrameRange: (fromIndex: number, toIndex: number) => void
  clearFrameSelection: () => void
  setTweenEasing: (easing: TweenEasing) => void
  generateTween: (fromIndex: number, toIndex: number, count: number) => void
  reorderFrames: (fromIndex: number, toIndex: number) => void
}

interface HistoryActions {
  saveHistory: () => void
  undo: () => void
  redo: () => void
}

// ============ CREATE STORE ============

interface EditorStore
  extends
    AnimationState,
    EditingState,
    OnionSkinState,
    SelectionState,
    HistoryState,
    AnimationActions,
    EditingActions,
    OnionSkinActions,
    SelectionActions,
    HistoryActions {
  // Computed values (not stored, derived from state)
  currentFrame: Frame
  onionSkinLayers: Array<{
    frame: Frame
    opacity: number
    type: 'previous' | 'next'
  }>
}

const useEditorStoreOriginal = create<EditorStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ============ INITIAL STATE ============
        ...DEFAULT_ANIMATION,
        ...DEFAULT_EDITING,
        ...DEFAULT_ONION_SKIN,
        ...DEFAULT_SELECTION,
        ...DEFAULT_HISTORY,

        // ============ COMPUTED VALUES ============
        get currentFrame() {
          const state = get() as EditorStore
          return state.frames[state.currentFrameIndex] || emptyFrame(9, 9)
        },

        get onionSkinLayers() {
          const state = get() as EditorStore
          const layers: Array<{
            frame: Frame
            opacity: number
            type: 'previous' | 'next'
          }> = []
          const {
            currentFrameIndex,
            frames,
            onionSkinEnabled,
            onionSkinMode,
            onionSkinPreviousOpacity,
            onionSkinNextOpacity,
          } = state

          if (!onionSkinEnabled) return []

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
        },

        // ============ ANIMATION ACTIONS ============
        setFrames: (frames) => set({ frames }),

        setCurrentFrameIndex: (index) =>
          set({
            currentFrameIndex: Math.max(
              0,
              Math.min(index, get().frames.length - 1),
            ),
          }),

        setFps: (fps) => set({ fps: Math.max(1, Math.min(30, fps)) }),

        togglePlaying: () =>
          set((state) => {
            if (state.frames.length <= 1) {
              return { isPlaying: false }
            }
            return { isPlaying: !state.isPlaying, isPaused: false }
          }),

        setPaused: (paused) => set({ isPaused: paused }),

        toggleLoop: () => set((state) => ({ loop: !state.loop })),

        addFrame: () =>
          set((state) => {
            const newFrame = emptyFrame(
              state.gridSize.rows,
              state.gridSize.cols,
            )
            const newFrames = [...state.frames]
            newFrames.splice(state.currentFrameIndex + 1, 0, newFrame)
            return {
              frames: newFrames,
              currentFrameIndex: state.currentFrameIndex + 1,
            }
          }),

        duplicateFrame: () =>
          set((state) => {
            const duplicated = cloneFrame(state.frames[state.currentFrameIndex])
            const newFrames = [...state.frames]
            newFrames.splice(state.currentFrameIndex + 1, 0, duplicated)
            return {
              frames: newFrames,
              currentFrameIndex: state.currentFrameIndex + 1,
            }
          }),

        deleteFrame: () =>
          set((state) => {
            if (state.frames.length <= 1) return state
            const newFrames = state.frames.filter(
              (_, i) => i !== state.currentFrameIndex,
            )
            return {
              frames: newFrames,
              currentFrameIndex: Math.max(0, state.currentFrameIndex - 1),
            }
          }),

        loadFrames: (frames) =>
          set((state) => {
            if (frames.length === 0) return state
            const rows = frames[0].length
            const cols = frames[0][0]?.length ?? 9
            return {
              frames: cloneFrames(frames),
              currentFrameIndex: 0,
              gridSize: { rows, cols },
            }
          }),

        // ============ EDITING ACTIONS ============
        setGridSize: (size) =>
          set((state) => {
            const newFrames = state.frames.map((frame) => {
              // Resize or pad existing frames
              const newFrame: Frame = []
              for (let r = 0; r < size.rows; r++) {
                const row: number[] = []
                for (let c = 0; c < size.cols; c++) {
                  row.push(frame[r]?.[c] ?? 0)
                }
                newFrame.push(row)
              }
              return newFrame
            })
            return { frames: newFrames, gridSize: size }
          }),

        setPalette: (palette) => set({ palette }),

        setTool: (tool) => set({ tool }),

        setBrushBrightness: (brightness) =>
          set({ brushBrightness: Math.max(0, Math.min(1, brightness)) }),

        toggleGlow: () => set((state) => ({ glow: !state.glow })),

        setBloomIntensity: (intensity) =>
          set({ bloomIntensity: Math.max(0, Math.min(100, intensity)) }),

        setTransitionSpeed: (speed) => set({ transitionSpeed: speed }),

        setFadeIntensity: (intensity) =>
          set({ fadeIntensity: Math.max(0, Math.min(100, intensity)) }),

        setGridVisibility: (visibility) => set({ gridVisibility: visibility }),

        setPixel: (row, col, value) =>
          set((state) => {
            const newFrames = cloneFrames(state.frames)
            newFrames[state.currentFrameIndex][row][col] = value
            return { frames: newFrames }
          }),

        setPixelsBatch: (updates) =>
          set((state) => {
            const newFrames = cloneFrames(state.frames)
            const frame = newFrames[state.currentFrameIndex]
            updates.forEach(({ row, col, value }) => {
              if (frame[row]?.[col] !== undefined) {
                frame[row][col] = value
              }
            })
            return { frames: newFrames }
          }),

        clearFrame: () =>
          set((state) => {
            const newFrames = cloneFrames(state.frames)
            newFrames[state.currentFrameIndex] = emptyFrame(
              state.gridSize.rows,
              state.gridSize.cols,
            )
            return { frames: newFrames }
          }),

        fillFrame: () =>
          set((state) => {
            const newFrames = cloneFrames(state.frames)
            newFrames[state.currentFrameIndex] = state.frames[
              state.currentFrameIndex
            ].map((row) => row.map(() => state.brushBrightness))
            return { frames: newFrames }
          }),

        loadPattern: (pattern) =>
          set((state) => ({
            frames: [cloneFrame(pattern)],
            currentFrameIndex: 0,
            gridSize: {
              rows: pattern.length,
              cols: pattern[0]?.length ?? 9,
            },
          })),

        // ============ ONION SKIN ACTIONS ============
        setOnionSkinEnabled: (enabled) => set({ onionSkinEnabled: enabled }),

        setOnionSkinOpacity: (previous, next) =>
          set({
            onionSkinPreviousOpacity: Math.max(0, Math.min(100, previous)),
            onionSkinNextOpacity: Math.max(0, Math.min(100, next)),
          }),

        setOnionSkinMode: (mode) => set({ onionSkinMode: mode }),

        toggleOnionSkin: () =>
          set((state) => ({ onionSkinEnabled: !state.onionSkinEnabled })),

        // ============ SELECTION ACTIONS ============
        setSelectedFrameIndex: (index) =>
          set({ selectedFrameIndices: [index] }),

        toggleFrameSelection: (index) =>
          set((state) => {
            const isSelected = state.selectedFrameIndices.includes(index)
            if (isSelected) {
              return {
                selectedFrameIndices: state.selectedFrameIndices.filter(
                  (i) => i !== index,
                ),
              }
            }
            return {
              selectedFrameIndices: [...state.selectedFrameIndices, index],
            }
          }),

        selectFrameRange: (fromIndex, toIndex) =>
          set({
            selectedFrameIndices: Array.from(
              { length: Math.abs(toIndex - fromIndex) + 1 },
              (_, i) => Math.min(fromIndex, toIndex) + i,
            ),
          }),

        clearFrameSelection: () => set({ selectedFrameIndices: [] }),

        setTweenEasing: (easing) => set({ tweenEasing: easing }),

        generateTween: (fromIndex, toIndex, count) =>
          set((state) => {
            if (fromIndex >= toIndex || count <= 0) return state

            const { tweenedFrames } = generateTweenFrames(
              state.frames,
              fromIndex,
              toIndex,
              Math.min(count, 20),
              state.tweenEasing,
            )

            // Insert tween frames (note: toIndex will shift after insertion)
            const newFrames = [...state.frames]
            const framesToRemove = toIndex - fromIndex - 1
            newFrames.splice(fromIndex + 1, framesToRemove, ...tweenedFrames)

            return {
              frames: newFrames,
              selectedFrameIndices: [],
            }
          }),

        reorderFrames: (fromIndex, toIndex) =>
          set((state) => {
            if (fromIndex === toIndex) return state

            const frames = [...state.frames]
            const [movedFrame] = frames.splice(fromIndex, 1)
            frames.splice(toIndex, 0, movedFrame)

            // Update current frame index
            let newCurrentIndex = state.currentFrameIndex
            if (state.currentFrameIndex === fromIndex) {
              newCurrentIndex = toIndex
            } else if (
              fromIndex < state.currentFrameIndex &&
              toIndex >= state.currentFrameIndex
            ) {
              newCurrentIndex = state.currentFrameIndex - 1
            } else if (
              fromIndex > state.currentFrameIndex &&
              toIndex <= state.currentFrameIndex
            ) {
              newCurrentIndex = state.currentFrameIndex + 1
            }

            return {
              frames,
              currentFrameIndex: newCurrentIndex,
              selectedFrameIndices: [],
            }
          }),

        // ============ HISTORY ACTIONS ============
        saveHistory: () =>
          set((state) => {
            const newHistory = state.history.slice(0, state.historyIndex + 1)
            newHistory.push(cloneFrames(state.frames))
            return {
              history: newHistory.slice(-50),
              historyIndex: Math.min(newHistory.length - 1, 49),
            }
          }),

        undo: () =>
          set((state) => {
            if (state.historyIndex < 0) return state
            const frames = cloneFrames(state.history[state.historyIndex])
            return {
              frames,
              historyIndex: state.historyIndex - 1,
            }
          }),

        redo: () =>
          set((state) => {
            if (state.historyIndex >= state.history.length - 1) return state
            const frames = cloneFrames(state.history[state.historyIndex + 1])
            return {
              frames,
              historyIndex: state.historyIndex + 1,
            }
          }),
      }),
      {
        name: 'editor-store',
        // Only persist specific keys (not history)
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) =>
                !['history', 'historyIndex', 'isPlaying', 'isPaused'].includes(
                  key,
                ),
            ),
          ) as Partial<EditorStore>,
      },
    ),
  ),
)

// ============ SELECTOR HOOKS ============
// Stable selector functions defined outside to avoid infinite loops

const selectToolbarSlice = (state: EditorStore) => ({
  tool: state.tool,
  brushBrightness: state.brushBrightness,
  glow: state.glow,
  bloomIntensity: state.bloomIntensity,
  fadeIntensity: state.fadeIntensity,
  transitionSpeed: state.transitionSpeed,
  gridVisibility: state.gridVisibility,
  isPaused: state.isPaused,
  loop: state.loop,
  setTool: state.setTool,
  setBrushBrightness: state.setBrushBrightness,
  toggleGlow: state.toggleGlow,
  setBloomIntensity: state.setBloomIntensity,
  setTransitionSpeed: state.setTransitionSpeed,
  setFadeIntensity: state.setFadeIntensity,
  setGridVisibility: state.setGridVisibility,
  setPaused: state.setPaused,
  toggleLoop: state.toggleLoop,
  setFps: state.setFps,
  setGridSize: state.setGridSize,
  setPalette: state.setPalette,
  fps: state.fps,
  palette: state.palette,
  gridSize: state.gridSize,
})

const selectEditorSlice = (state: EditorStore) => ({
  frames: state.frames,
  currentFrameIndex: state.currentFrameIndex,
  gridSize: state.gridSize,
  palette: state.palette,
  tool: state.tool,
  brushBrightness: state.brushBrightness,
  glow: state.glow,
  bloomIntensity: state.bloomIntensity,
  fadeIntensity: state.fadeIntensity,
  transitionSpeed: state.transitionSpeed,
  gridVisibility: state.gridVisibility,
  onionSkinEnabled: state.onionSkinEnabled,
  onionSkinPreviousOpacity: state.onionSkinPreviousOpacity,
  onionSkinNextOpacity: state.onionSkinNextOpacity,
  onionSkinMode: state.onionSkinMode,
  selectedFrameIndices: state.selectedFrameIndices,
  isPlaying: state.isPlaying,
  fps: state.fps,
  loop: state.loop,
  isPaused: state.isPaused,
  setPixel: state.setPixel,
  setPixelsBatch: state.setPixelsBatch,
  saveHistory: state.saveHistory,
  undo: state.undo,
  redo: state.redo,
  clearFrame: state.clearFrame,
  setCurrentFrameIndex: state.setCurrentFrameIndex,
})

const selectAnimationSlice = (state: EditorStore) => ({
  frames: state.frames,
  currentFrameIndex: state.currentFrameIndex,
  fps: state.fps,
  isPlaying: state.isPlaying,
  isPaused: state.isPaused,
  loop: state.loop,
  togglePlaying: state.togglePlaying,
  setFps: state.setFps,
  setCurrentFrameIndex: state.setCurrentFrameIndex,
  addFrame: state.addFrame,
  duplicateFrame: state.duplicateFrame,
  deleteFrame: state.deleteFrame,
  undo: state.undo,
  redo: state.redo,
  onionSkinEnabled: state.onionSkinEnabled,
  onionSkinPreviousOpacity: state.onionSkinPreviousOpacity,
  onionSkinNextOpacity: state.onionSkinNextOpacity,
  onionSkinMode: state.onionSkinMode,
  toggleOnionSkin: state.toggleOnionSkin,
  setOnionSkinOpacity: state.setOnionSkinOpacity,
  setOnionSkinMode: state.setOnionSkinMode,
  selectedFrameIndices: state.selectedFrameIndices,
  tweenEasing: state.tweenEasing,
  setSelectedFrameIndex: state.setSelectedFrameIndex,
  toggleFrameSelection: state.toggleFrameSelection,
  selectFrameRange: state.selectFrameRange,
  clearFrameSelection: state.clearFrameSelection,
  generateTween: state.generateTween,
  setTweenEasing: state.setTweenEasing,
  reorderFrames: state.reorderFrames,
  gridSize: state.gridSize,
  palette: state.palette,
})

const selectPreviewSlice = (state: EditorStore) => ({
  frames: state.frames,
  currentFrameIndex: state.currentFrameIndex,
  gridSize: state.gridSize,
  palette: state.palette,
  gridVisibility: state.gridVisibility,
  glow: state.glow,
  fps: state.fps,
})

const selectExportSlice = (state: EditorStore) => ({
  frames: state.frames,
  currentFrameIndex: state.currentFrameIndex,
  gridSize: state.gridSize,
  palette: state.palette,
  fps: state.fps,
  glow: state.glow,
})

const selectLoadActions = (state: EditorStore) => ({
  loadPattern: state.loadPattern,
  loadFrames: state.loadFrames,
  palette: state.palette,
})

// Reusable hooks
export function useToolbarState() {
  return useEditorStoreOriginal(useShallow(selectToolbarSlice))
}

export function useEditorState() {
  return useEditorStoreOriginal(useShallow(selectEditorSlice))
}

export function useAnimationState() {
  return useEditorStoreOriginal(useShallow(selectAnimationSlice))
}

export function usePreviewState() {
  return useEditorStoreOriginal(useShallow(selectPreviewSlice))
}

export function useExportState() {
  return useEditorStoreOriginal(useShallow(selectExportSlice))
}

export function useLoadActions() {
  return useEditorStoreOriginal(useShallow(selectLoadActions))
}

// ============ EXPORT STORE ============
export { useEditorStoreOriginal as useEditorStore }

// Re-export types
export type { EditorStore }
