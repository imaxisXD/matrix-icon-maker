import {
  Play,
  Pause,
  Plus,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { EditorStore } from '../../stores/editorStore'
import { Matrix } from '../ui/Matrix'

interface AnimationTimelineProps {
  store: EditorStore
}

export function AnimationTimeline({ store }: AnimationTimelineProps) {
  const {
    state,
    addFrame,
    duplicateFrame,
    deleteFrame,
    setCurrentFrame,
    setFps,
    togglePlaying,
  } = store

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlaying}
            className={`flex items-center gap-2 rounded border px-3 py-1.5 text-xs font-bold transition-all ${
              state.isPlaying
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400'
            }`}
          >
            {state.isPlaying ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            {state.isPlaying ? 'PAUSE' : 'PLAY'}
          </button>

          <div className="flex items-center gap-2 border-l border-zinc-200 pl-3">
            <span className="text-[10px] font-bold uppercase text-zinc-400">
              Speed
            </span>
            <input
              type="range"
              min="1"
              max="30"
              value={state.fps}
              onChange={(e) => setFps(Number(e.target.value))}
              className="h-1 w-24 appearance-none rounded-full bg-zinc-200 accent-zinc-900"
            />
            <span className="w-8 font-mono text-xs text-zinc-900">
              {state.fps} FPS
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={addFrame}
            className="flex h-8 w-8 items-center justify-center rounded border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-900 hover:text-zinc-900"
            title="Add Frame"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={duplicateFrame}
            className="flex h-8 w-8 items-center justify-center rounded border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-900 hover:text-zinc-900"
            title="Duplicate Frame"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={deleteFrame}
            className="flex h-8 w-8 items-center justify-center rounded border border-zinc-200 text-zinc-500 transition-colors hover:border-red-500 hover:text-red-500"
            title="Delete Frame"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentFrame(state.currentFrameIndex - 1)}
          disabled={state.currentFrameIndex === 0}
          className="flex h-20 w-8 items-center justify-center rounded border border-zinc-200 text-zinc-400 disabled:opacity-30 hover:bg-zinc-50 hover:text-zinc-900"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 gap-3 overflow-x-auto pb-2">
          {state.frames.map((frame, index) => (
            <button
              key={index}
              onClick={() => setCurrentFrame(index)}
              className={`group relative flex flex-shrink-0 flex-col items-center gap-2 rounded border p-2 transition-all ${
                index === state.currentFrameIndex
                  ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                  : 'border-zinc-200 bg-white hover:border-zinc-400'
              }`}
            >
              <Matrix
                rows={state.gridSize.rows}
                cols={state.gridSize.cols}
                pattern={frame}
                size={4}
                gap={1}
                palette={state.palette}
                glow={false}
              />
              <span
                className={`font-mono text-[9px] ${
                  index === state.currentFrameIndex
                    ? 'text-zinc-900 font-bold'
                    : 'text-zinc-400'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentFrame(state.currentFrameIndex + 1)}
          disabled={state.currentFrameIndex === state.frames.length - 1}
          className="flex h-20 w-8 items-center justify-center rounded border border-zinc-200 text-zinc-400 disabled:opacity-30 hover:bg-zinc-50 hover:text-zinc-900"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
