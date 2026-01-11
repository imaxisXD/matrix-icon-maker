import {
  Brush,
  Eraser,
  PaintBucket,
  Trash2,
  Undo2,
  Redo2,
  Play,
  Pause,
  Repeat,
  Gauge,
  Minus,
  Plus,
} from 'lucide-react'
import type { EditorStore, Tool } from '../../stores/editorStore'

interface EditorToolbarProps {
  store: EditorStore
}

const TOOLS: { id: Tool; icon: typeof Brush; label: string }[] = [
  { id: 'brush', icon: Brush, label: 'Brush' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
  { id: 'fill', icon: PaintBucket, label: 'Fill' },
]

const BRIGHTNESS_LEVELS = [0.25, 0.5, 0.75, 1.0]

const GRID_SIZES = [
  { rows: 5, cols: 5, label: '5x5' },
  { rows: 7, cols: 7, label: '7x7' },
  { rows: 9, cols: 9, label: '9x9' },
  { rows: 12, cols: 12, label: '12x12' },
  { rows: 16, cols: 16, label: '16x16' },
]

const COLOR_PRESETS = [
  { on: '#0066cc', off: '#f0efe9', label: 'Blue' },
  { on: '#ff6b00', off: '#f0efe9', label: 'Orange' },
  { on: '#00aa55', off: '#f0efe9', label: 'Green' },
  { on: '#dd3355', off: '#f0efe9', label: 'Pink' },
  { on: '#7c3aed', off: '#f0efe9', label: 'Purple' },
  { on: '#d97706', off: '#f0efe9', label: 'Yellow' },
  { on: '#2a2a2a', off: '#f0efe9', label: 'Black' },
  { on: '#cc4400', off: '#f0efe9', label: 'Red' },
]

// Screw head component for industrial hardware aesthetic
function ScrewHead({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="5" fill="#ffffff" stroke="#e0ddd5" strokeWidth="1" />
      <line x1="3" y1="6" x2="9" y2="6" stroke="#d4d0c8" strokeWidth="1" />
      <line x1="6" y1="3" x2="6" y2="9" stroke="#d4d0c8" strokeWidth="1" />
    </svg>
  )
}

export function EditorToolbar({ store }: EditorToolbarProps) {
  const {
    state,
    setTool,
    setBrushBrightness,
    setGridSize,
    setPalette,
    togglePaused,
    toggleLoop,
    setFps,
    setBloomIntensity,
    setTransitionSpeed,
    setFadeIntensity,
    clearFrame,
    undo,
    redo,
  } = store

  return (
    <div className="flex flex-col gap-5">
      {/* Main Panel */}
      <div className="relative overflow-hidden rounded-lg border border-[#e0ddd5] bg-white shadow-sm">
        {/* Corner Screw Heads */}
        <ScrewHead className="absolute top-2 left-2 h-3 w-3 opacity-60" />
        <ScrewHead className="absolute top-2 right-2 h-3 w-3 opacity-60" />
        <ScrewHead className="absolute bottom-2 left-2 h-3 w-3 opacity-60" />
        <ScrewHead className="absolute bottom-2 right-2 h-3 w-3 opacity-60" />

        <div className="p-4 space-y-6">
          {/* Tools Group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Tools
              </label>
              <div className="h-px flex-1 mx-3 bg-gradient-to-r from-[#0066cc]/10 to-transparent" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setTool(tool.id)}
                  className={`relative h-11 flex items-center justify-center border transition-all group ${
                    state.tool === tool.id
                      ? 'border-[#0066cc] bg-[#e6f0ff] shadow-sm'
                      : 'border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#d4d0c8] hover:bg-[#f8f7f4]'
                  }`}
                  title={tool.label}
                >
                  <tool.icon
                    className={`h-4 w-4 transition-colors ${
                      state.tool === tool.id ? 'text-[#0066cc]' : ''
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Brightness Group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Intensity
              </label>
              <div className="h-px flex-1 mx-3 bg-gradient-to-r from-[#0066cc]/10 to-transparent" />
            </div>
            <div className="flex gap-2">
              {BRIGHTNESS_LEVELS.map((level, index) => (
                <button
                  key={level}
                  onClick={() => setBrushBrightness(level)}
                  className={`relative h-10 flex-1 border transition-all overflow-hidden ${
                    state.brushBrightness === level
                      ? 'border-[#0066cc] ring-1 ring-[#0066cc]/30'
                      : 'border-[#e0ddd5] hover:border-[#d4d0c8]'
                  }`}
                >
                  <div
                    className="h-full w-full transition-all"
                    style={{
                      backgroundColor: state.palette.on,
                      opacity: level,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Grid Size Group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Resolution
              </label>
              <div className="h-px flex-1 mx-3 bg-gradient-to-r from-[#0066cc]/10 to-transparent" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {GRID_SIZES.map((size) => (
                <button
                  key={size.label}
                  onClick={() => setGridSize(size.rows, size.cols)}
                  className={`px-2 py-2 text-[10px] font-bold tracking-wider border transition-all ${
                    state.gridSize.rows === size.rows &&
                    state.gridSize.cols === size.cols
                      ? 'border-[#0066cc] bg-[#e6f0ff] text-[#0066cc]'
                      : 'border-[#e0ddd5] bg-white text-[#6a6a6a] hover:border-[#d4d0c8] hover:bg-[#f8f7f4]'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Visibility Group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Grid Visibility
              </label>
              <div className="h-px flex-1 mx-3 bg-gradient-to-r from-[#0066cc]/10 to-transparent" />
            </div>
            <div className="flex bg-[#f0efe9] p-1 rounded border border-[#e0ddd5]">
              <button
                onClick={() => store.setGridVisibility('hidden')}
                className={`flex-1 flex items-center justify-center p-2 rounded text-[9px] font-bold tracking-wider transition-all ${
                  state.gridVisibility === 'hidden'
                    ? 'bg-white text-[#0066cc] shadow-sm'
                    : 'text-[#8a8a8a] hover:text-[#6a6a6a]'
                }`}
                title="Hidden"
              >
                OFF
              </button>
              <button
                onClick={() => store.setGridVisibility('normal')}
                className={`flex-1 flex items-center justify-center p-2 rounded text-[9px] font-bold tracking-wider transition-all ${
                  state.gridVisibility === 'normal'
                    ? 'bg-white text-[#0066cc] shadow-sm'
                    : 'text-[#8a8a8a] hover:text-[#6a6a6a]'
                }`}
                title="Normal"
              >
                MID
              </button>
              <button
                onClick={() => store.setGridVisibility('prominent')}
                className={`flex-1 flex items-center justify-center p-2 rounded text-[9px] font-bold tracking-wider transition-all ${
                  state.gridVisibility === 'prominent'
                    ? 'bg-white text-[#0066cc] shadow-sm'
                    : 'text-[#8a8a8a] hover:text-[#6a6a6a]'
                }`}
                title="Prominent"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Colors Group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Palette
              </label>
              <div className="h-px flex-1 mx-3 bg-gradient-to-r from-[#0066cc]/10 to-transparent" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setPalette(preset.on, preset.off)}
                  className={`relative aspect-square w-full border transition-all overflow-hidden group ${
                    state.palette.on === preset.on
                      ? 'border-[#0066cc] p-0.5 ring-1 ring-[#0066cc]/30 scale-95'
                      : 'border-[#e0ddd5] hover:scale-95'
                  }`}
                  title={preset.label}
                >
                  <div
                    className="h-full w-full rounded-sm shadow-sm"
                    style={{ backgroundColor: preset.on }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Effect Controls Group */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Effects
              </label>
              <div className="h-px flex-1 mx-3 bg-gradient-to-r from-[#0066cc]/10 to-transparent" />
            </div>

            {/* FPS Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#8a8a8a] flex items-center gap-1.5 uppercase tracking-wider">
                  <Gauge className="h-3 w-3" />
                  Speed
                </span>
                <span className="text-[10px] font-mono text-[#0066cc]">
                  {state.fps} FPS
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFps(Math.max(1, state.fps - 1))}
                  className="h-7 w-7 flex items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#0066cc]/50 hover:text-[#0066cc] transition-all"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <div className="flex-1 h-1.5 bg-[#f0efe9] rounded-full overflow-hidden border border-[#e0ddd5]">
                  <div
                    className="h-full bg-gradient-to-r from-[#0066cc] to-[#3388dd] transition-all duration-150"
                    style={{ width: `${(state.fps / 60) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => setFps(Math.min(60, state.fps + 1))}
                  className="h-7 w-7 flex items-center justify-center rounded border border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#0066cc]/50 hover:text-[#0066cc] transition-all"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex gap-2">
              <button
                onClick={togglePaused}
                className={`relative flex flex-1 items-center justify-center gap-1.5 border py-2.5 text-[10px] font-bold tracking-wider transition-all ${
                  state.isPaused
                    ? 'border-[#ff6b00] bg-[#fff5ed] text-[#ff6b00]'
                    : 'border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#d4d0c8] hover:text-[#6a6a6a]'
                }`}
                title={state.isPaused ? 'Resume' : 'Pause'}
              >
                {state.isPaused ? (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    PAUSED
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    ACTIVE
                  </>
                )}
              </button>
              <button
                onClick={toggleLoop}
                className={`relative flex flex-1 items-center justify-center gap-1.5 border py-2.5 text-[10px] font-bold tracking-wider transition-all ${
                  state.loop
                    ? 'border-[#0066cc] bg-[#e6f0ff] text-[#0066cc]'
                    : 'border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#d4d0c8] hover:text-[#6a6a6a]'
                }`}
                title={state.loop ? 'Looping On' : 'Looping Off'}
              >
                <Repeat className="h-3.5 w-3.5" />
                {state.loop ? 'LOOP' : 'ONCE'}
              </button>
            </div>
          </div>

          {/* Visual Effects Group */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Visual FX
              </label>
              <div className="h-px flex-1 mx-3 bg-gradient-to-r from-[#0066cc]/10 to-transparent" />
            </div>

            {/* Bloom Intensity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider text-[#8a8a8a]">Bloom</span>
                <span className="text-[10px] font-mono text-[#7c3aed]">
                  {state.bloomIntensity}%
                </span>
              </div>
              <div className="h-1.5 bg-[#f0efe9] rounded-full overflow-hidden border border-[#e0ddd5]">
                <div
                  className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] transition-all"
                  style={{ width: `${state.bloomIntensity}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={state.bloomIntensity}
                onChange={(e) => setBloomIntensity(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-4"
                style={{ marginTop: '-8px' }}
              />
            </div>

            {/* Fade Intensity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider text-[#8a8a8a]">Fade</span>
                <span className="text-[10px] font-mono text-[#0891b2]">
                  {state.fadeIntensity}%
                </span>
              </div>
              <div className="h-1.5 bg-[#f0efe9] rounded-full overflow-hidden border border-[#e0ddd5]">
                <div
                  className="h-full bg-gradient-to-r from-[#0891b2] to-[#22d3ee] transition-all"
                  style={{ width: `${state.fadeIntensity}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={state.fadeIntensity}
                onChange={(e) => setFadeIntensity(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-4"
                style={{ marginTop: '-8px' }}
              />
            </div>

            {/* Transition Speed */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-wider text-[#8a8a8a]">Transition</span>
              <div className="flex bg-[#f0efe9] p-1 rounded border border-[#e0ddd5]">
                {(['slow', 'normal', 'fast'] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setTransitionSpeed(speed)}
                    className={`flex-1 py-2 rounded text-[9px] font-bold tracking-wider transition-all ${
                      state.transitionSpeed === speed
                        ? 'bg-white text-[#0066cc] shadow-sm'
                        : 'text-[#8a8a8a] hover:text-[#6a6a6a]'
                    }`}
                  >
                    {speed.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#e0ddd5] to-transparent" />
      </div>

      {/* Actions Panel */}
      <div className="relative overflow-hidden rounded-lg border border-[#e0ddd5] bg-white shadow-sm">
        <div className="p-4">
          <div className="flex gap-2">
            <button
              onClick={undo}
              className="relative flex-1 flex items-center justify-center border border-[#e0ddd5] bg-white py-2.5 text-[#8a8a8a] hover:border-[#0066cc]/50 hover:text-[#0066cc] transition-all"
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              onClick={redo}
              className="relative flex-1 flex items-center justify-center border border-[#e0ddd5] bg-white py-2.5 text-[#8a8a8a] hover:border-[#0066cc]/50 hover:text-[#0066cc] transition-all"
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </button>
            <button
              onClick={clearFrame}
              className="relative flex-1 flex items-center justify-center border border-[#e0ddd5] bg-white py-2.5 text-[#dd3355] hover:border-[#dd3355] hover:bg-[#fff5f5] transition-all"
              title="Clear"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
