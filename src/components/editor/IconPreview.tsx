import { Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import type { EditorStore } from '../../stores/editorStore'
import { Matrix } from '../ui/Matrix'

interface IconPreviewProps {
  store: EditorStore
}

const SIZE_VARIATIONS = [
  { size: 4, gap: 1, label: 'size-4' },
  { size: 6, gap: 1, label: 'size-6' },
  { size: 8, gap: 2, label: 'size-8' },
  { size: 10, gap: 2, label: 'size-10' },
]

export function IconPreview({ store }: IconPreviewProps) {
  const { state } = store
  const [darkBg, setDarkBg] = useState(false) // Default to light

  const frames = state.frames
  const isAnimated = state.isPlaying && frames.length > 1

  // Compute palette based on gridVisibility
  const getPreviewPalette = () => {
    if (state.gridVisibility === 'hidden') {
      return { on: state.palette.on, off: 'transparent' }
    }
    if (state.gridVisibility === 'prominent') {
      return { on: state.palette.on, off: darkBg ? '#3f3f46' : '#a1a1aa' } // zinc-700 or zinc-400
    }
    return state.palette
  }

  const previewPalette = getPreviewPalette()

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Preview Output
          </h3>
          <button
            onClick={() => setDarkBg(!darkBg)}
            className={`flex items-center gap-1.5 rounded bg-zinc-100 px-2 py-1 text-[10px] font-medium transition-colors hover:bg-zinc-200 ${
              darkBg ? 'text-zinc-900' : 'text-zinc-500'
            }`}
            title="Toggle Background Contrast"
          >
            {darkBg ? (
              <Moon className="h-3 w-3" />
            ) : (
              <Sun className="h-3 w-3" />
            )}
            {darkBg ? 'DARK' : 'LIGHT'}
          </button>
        </div>

        <div className="p-6">
          {/* Main Preview */}
          <div
            className={`mb-6 flex items-center justify-center rounded border p-8 transition-colors ${
              darkBg
                ? 'border-zinc-800 bg-zinc-950'
                : 'border-zinc-200 bg-white'
            }`}
          >
            {isAnimated ? (
              <Matrix
                rows={state.gridSize.rows}
                cols={state.gridSize.cols}
                frames={frames}
                fps={state.fps}
                loop
                size={12}
                gap={2}
                palette={previewPalette}
                glow={state.glow}
              />
            ) : (
              <Matrix
                rows={state.gridSize.rows}
                cols={state.gridSize.cols}
                pattern={frames[state.currentFrameIndex]}
                size={12}
                gap={2}
                palette={previewPalette}
                glow={state.glow}
              />
            )}
          </div>

          {/* Size Variations */}
          <div>
            <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Responsive Sizes
            </h4>
            <div
              className={`flex items-end justify-around gap-4 rounded border p-4 ${
                darkBg
                  ? 'border-zinc-800 bg-zinc-900'
                  : 'border-zinc-100 bg-zinc-50'
              }`}
            >
              {SIZE_VARIATIONS.map((variation) => (
                <div
                  key={variation.label}
                  className="flex flex-col items-center gap-2"
                >
                  <Matrix
                    rows={state.gridSize.rows}
                    cols={state.gridSize.cols}
                    pattern={frames[state.currentFrameIndex]}
                    size={variation.size}
                    gap={variation.gap}
                    palette={previewPalette}
                    glow={state.glow}
                  />
                  <span
                    className={`font-mono text-[9px] ${darkBg ? 'text-zinc-500' : 'text-zinc-400'}`}
                  >
                    {variation.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
