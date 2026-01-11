import { Monitor, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import type { EditorStore } from '../../stores/editorStore'
import { Matrix } from '../ui/Matrix'

interface IconPreviewProps {
  store: EditorStore
}

const SIZE_VARIATIONS = [
  { size: 4, gap: 1, label: '16px' },
  { size: 6, gap: 1, label: '24px' },
  { size: 8, gap: 2, label: '32px' },
  { size: 10, gap: 2, label: '40px' },
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

export function IconPreview({ store }: IconPreviewProps) {
  const { state } = store
  const [darkBg, setDarkBg] = useState(false)

  const frames = state.frames

  const getPreviewPalette = () => {
    if (state.gridVisibility === 'hidden') {
      return { on: state.palette.on, off: 'transparent' }
    }
    if (state.gridVisibility === 'prominent') {
      return { on: state.palette.on, off: darkBg ? '#2a2a3a' : '#e0ddd5' }
    }
    return state.palette
  }

  const previewPalette = getPreviewPalette()

  return (
    <div className="flex flex-col gap-5">
      {/* Preview Panel */}
      <div className="relative overflow-hidden rounded-lg border border-[#e0ddd5] bg-white shadow-sm">
        {/* Corner Screw Heads */}
        <ScrewHead className="absolute top-2 left-2 h-3 w-3 opacity-60" />
        <ScrewHead className="absolute top-2 right-2 h-3 w-3 opacity-60" />
        <ScrewHead className="absolute bottom-2 left-2 h-3 w-3 opacity-60" />
        <ScrewHead className="absolute bottom-2 right-2 h-3 w-3 opacity-60" />

        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-[#e0ddd5] px-4 py-3 bg-[#f8f7f4]/50">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-[#0066cc]" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 102, 204, 0.3))' }} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
              Preview Output
            </h3>
          </div>
          <button
            onClick={() => setDarkBg(!darkBg)}
            className={`flex items-center gap-2 rounded border px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all ${
              darkBg
                ? 'border-[#0066cc] bg-[#e6f0ff] text-[#0066cc]'
                : 'border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#d4d0c8]'
            }`}
            title="Toggle Background Contrast"
          >
            {darkBg ? (
              <>
                <Moon className="h-3 w-3" />
                Dark
              </>
            ) : (
              <>
                <Sun className="h-3 w-3" />
                Light
              </>
            )}
          </button>
        </div>

        <div className="p-5">
          {/* Size Variations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]">
                Responsive Sizes
              </h4>
              <div className="h-px flex-1 mx-4 bg-gradient-to-r from-[#0066cc]/10 to-transparent" />
            </div>
            <div
              className={`relative flex items-end justify-around gap-4 rounded-lg border p-5 overflow-hidden ${
                darkBg
                  ? 'border-[#2a2a3a] bg-[#1a1a24]'
                  : 'border-[#e0ddd5] bg-[#f8f7f4]'
              }`}
            >
              {/* Subtle grid background for preview area */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                  backgroundSize: '8px 8px',
                  color: darkBg ? '#3a3a4a' : '#d4d0c8',
                }}
              />

              {SIZE_VARIATIONS.map((variation) => (
                <div
                  key={variation.label}
                  className="relative flex flex-col items-center gap-3"
                >
                  <div className="relative">
                    {/* Size indicator corner */}
                    <div className="absolute -top-1 -left-1 h-1.5 w-1.5 border-l border-t border-[#0066cc]/20" />
                    <div className="absolute -top-1 -right-1 h-1.5 w-1.5 border-r border-t border-[#0066cc]/20" />
                    <div className="absolute -bottom-1 -left-1 h-1.5 w-1.5 border-l border-b border-[#0066cc]/20" />
                    <div className="absolute -bottom-1 -right-1 h-1.5 w-1.5 border-r border-b border-[#0066cc]/20" />

                    <Matrix
                      rows={state.gridSize.rows}
                      cols={state.gridSize.cols}
                      pattern={frames[state.currentFrameIndex]}
                      size={variation.size}
                      gap={variation.gap}
                      palette={previewPalette}
                      glow={state.glow}
                    />
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#8a8a8a]">
                    {variation.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Info Display */}
          <div className="mt-5 pt-4 border-t border-[#e0ddd5]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-wider text-[#8a8a8a]">
                Active Color
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded border border-[#e0ddd5] shadow-sm"
                    style={{ backgroundColor: state.palette.on }}
                  />
                  <span className="font-mono text-[9px] text-[#6a6a6a]">
                    {state.palette.on}
                  </span>
                </div>
                <div className="h-px w-8 bg-[#e0ddd5]" />
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded border border-[#e0ddd5] shadow-sm"
                    style={{ backgroundColor: state.gridVisibility === 'hidden' ? '#ffffff' : previewPalette.off }}
                  />
                  <span className="font-mono text-[9px] text-[#6a6a6a]">
                    {state.gridVisibility === 'hidden' ? 'transparent' : previewPalette.off}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Panel */}
      <div className="relative overflow-hidden rounded-lg border border-[#e0ddd5] bg-white shadow-sm">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-[9px] uppercase tracking-wider text-[#8a8a8a] mb-1">
                Resolution
              </div>
              <div className="text-lg font-bold text-[#0066cc]">
                {state.gridSize.rows}x{state.gridSize.cols}
              </div>
            </div>
            <div className="text-center border-l border-r border-[#e0ddd5]">
              <div className="text-[9px] uppercase tracking-wider text-[#8a8a8a] mb-1">
                Frames
              </div>
              <div className="text-lg font-bold text-[#7c3aed]">
                {state.frames.length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[9px] uppercase tracking-wider text-[#8a8a8a] mb-1">
                FPS
              </div>
              <div className="text-lg font-bold text-[#00aa55]">
                {state.fps}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
