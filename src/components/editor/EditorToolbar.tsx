import {
  Brush,
  Eraser,
  PaintBucket,
  Trash2,
  Undo2,
  Redo2,
  Sparkles,
  Play,
  Pause,
  Repeat,
  Gauge,
} from 'lucide-react'
import type { EditorStore, Tool } from '../../stores/editorStore'

interface EditorToolbarProps {
  store: EditorStore
}

const TOOLS: { id: Tool; icon: React.ReactNode; label: string }[] = [
  { id: 'brush', icon: <Brush className="w-4 h-4" />, label: 'Brush' },
  { id: 'eraser', icon: <Eraser className="w-4 h-4" />, label: 'Eraser' },
  { id: 'fill', icon: <PaintBucket className="w-4 h-4" />, label: 'Fill' },
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
  { on: 'hsl(220, 13%, 10%)', off: 'hsl(210, 40%, 96.1%)', label: 'Obsidian' },
  {
    on: 'hsl(221.2, 83.2%, 53.3%)',
    off: 'hsl(210, 40%, 96.1%)',
    label: 'Blue',
  },
  { on: 'hsl(346.8, 77.2%, 49.8%)', off: 'hsl(210, 40%, 96.1%)', label: 'Red' },
  {
    on: 'hsl(142.1, 76.2%, 36.3%)',
    off: 'hsl(210, 40%, 96.1%)',
    label: 'Green',
  },
  {
    on: 'hsl(262.1, 83.3%, 57.8%)',
    off: 'hsl(210, 40%, 96.1%)',
    label: 'Purple',
  },
  { on: 'hsl(24.6, 95%, 53.1%)', off: 'hsl(210, 40%, 96.1%)', label: 'Orange' },
  { on: 'hsl(180, 100%, 25%)', off: 'hsl(210, 40%, 96.1%)', label: 'Cyan' },
  { on: 'hsl(320, 80%, 45%)', off: 'hsl(210, 40%, 96.1%)', label: 'Pink' },
]

export function EditorToolbar({ store }: EditorToolbarProps) {
  const {
    state,
    setTool,
    setBrushBrightness,
    setGridSize,
    setPalette,
    toggleGlow,
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
    <div className="flex flex-col gap-8 h-full">
      {/* Tools Group */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Tools
        </label>
        <div className="flex gap-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setTool(tool.id)}
              className={`flex h-10 flex-1 items-center justify-center border transition-all ${
                state.tool === tool.id
                  ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                  : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-900'
              }`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Brightness Group */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Intensity
        </label>
        <div className="flex gap-2">
          {BRIGHTNESS_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setBrushBrightness(level)}
              className={`h-10 flex-1 border transition-all ${
                state.brushBrightness === level
                  ? 'border-zinc-900 ring-1 ring-zinc-900'
                  : 'border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <div
                className="h-full w-full opacity-90"
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
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Resolution
        </label>
        <div className="grid grid-cols-3 gap-2">
          {GRID_SIZES.map((size) => (
            <button
              key={size.label}
              onClick={() => setGridSize(size.rows, size.cols)}
              className={`px-2 py-1.5 text-xs font-medium border transition-all ${
                state.gridSize.rows === size.rows &&
                state.gridSize.cols === size.cols
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Visibility Group */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Grid
        </label>
        <div className="flex bg-zinc-100 p-1 rounded-md">
          <button
            onClick={() => store.setGridVisibility('hidden')}
            className={`flex-1 flex items-center justify-center p-1.5 rounded text-[10px] font-medium transition-all ${
              state.gridVisibility === 'hidden'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
            title="Hidden"
          >
            OFF
          </button>
          <button
            onClick={() => store.setGridVisibility('normal')}
            className={`flex-1 flex items-center justify-center p-1.5 rounded text-[10px] font-medium transition-all ${
              state.gridVisibility === 'normal'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
            title="Normal"
          >
            MID
          </button>
          <button
            onClick={() => store.setGridVisibility('prominent')}
            className={`flex-1 flex items-center justify-center p-1.5 rounded text-[10px] font-medium transition-all ${
              state.gridVisibility === 'prominent'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
            title="Prominent"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Colors Group */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Palette
        </label>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setPalette(preset.on, preset.off)}
              className={`aspect-square w-full border transition-all ${
                state.palette.on === preset.on
                  ? 'border-zinc-900 ring-1 ring-zinc-900 scale-90'
                  : 'border-zinc-200 hover:scale-95'
              }`}
              style={{ backgroundColor: preset.on }}
              title={preset.label}
            />
          ))}
        </div>
      </div>

      {/* Effect Controls Group */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Effects
        </label>

        {/* FPS Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              FPS
            </span>
            <span className="text-[10px] font-mono text-zinc-700">
              {state.fps}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="60"
            value={state.fps}
            onChange={(e) => setFps(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
          />
        </div>

        {/* Playback Controls */}
        <div className="flex gap-2">
          <button
            onClick={togglePaused}
            className={`flex flex-1 items-center justify-center gap-1.5 border py-2 text-xs font-medium transition-all ${
              state.isPaused
                ? 'border-amber-500 bg-amber-50 text-amber-700'
                : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900'
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
                PAUSE
              </>
            )}
          </button>
          <button
            onClick={toggleLoop}
            className={`flex flex-1 items-center justify-center gap-1.5 border py-2 text-xs font-medium transition-all ${
              state.loop
                ? 'border-zinc-900 bg-zinc-50 text-zinc-900'
                : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900'
            }`}
            title={state.loop ? 'Looping On' : 'Looping Off'}
          >
            <Repeat className="h-3.5 w-3.5" />
            {state.loop ? 'LOOP' : 'ONCE'}
          </button>
        </div>
      </div>

      {/* Visual Effects Group */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Visual FX
        </label>

        {/* Bloom Intensity Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">Bloom</span>
            <span className="text-[10px] font-mono text-zinc-700">
              {state.bloomIntensity}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.bloomIntensity}
            onChange={(e) => setBloomIntensity(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Fade Intensity Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">Fade</span>
            <span className="text-[10px] font-mono text-zinc-700">
              {state.fadeIntensity}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.fadeIntensity}
            onChange={(e) => setFadeIntensity(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
        </div>

        {/* Transition Speed */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-zinc-500">Transition</span>
          <div className="flex bg-zinc-100 p-1 rounded-md">
            {(['slow', 'normal', 'fast'] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => setTransitionSpeed(speed)}
                className={`flex-1 py-1 rounded text-[10px] font-medium transition-all ${
                  state.transitionSpeed === speed
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {speed.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-zinc-200 my-2" />

      {/* Actions Group */}
      <div className="space-y-4">
        <button
          onClick={toggleGlow}
          className={`flex w-full items-center justify-center gap-2 border px-4 py-2 text-sm font-medium transition-all ${
            state.glow
              ? 'border-zinc-900 bg-zinc-50 text-zinc-900'
              : 'border-zinc-200 text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          {state.glow ? 'GLOW: ON' : 'GLOW: OFF'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={undo}
            className="flex flex-1 items-center justify-center border border-zinc-200 py-2 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            className="flex flex-1 items-center justify-center border border-zinc-200 py-2 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>
          <button
            onClick={clearFrame}
            className="flex flex-1 items-center justify-center border border-zinc-200 py-2 text-red-500 hover:border-red-500 hover:bg-red-50"
            title="Clear"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
