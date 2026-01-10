import { useState } from 'react'
import {
  presets,
  presetCategories,
  type PresetPattern,
} from '../../data/presets'
import { Matrix } from '../ui/Matrix'
import type { EditorStore } from '../../stores/editorStore'

interface PresetPatternsProps {
  store: EditorStore
  onPatternSelect?: () => void
}

export function PresetPatterns({
  store,
  onPatternSelect,
}: PresetPatternsProps) {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const { loadFrames } = store

  const filteredPresets = presets.filter((preset) => {
    const matchesCategory = category === 'all' || preset.category === category
    const matchesSearch = preset.name
      .toLowerCase()
      .includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSelect = (preset: PresetPattern) => {
    loadFrames(preset.frames)
    onPatternSelect?.()
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Search & Filter */}
      <div className="space-y-3 border-b border-zinc-100 pb-4">
        <input
          type="text"
          placeholder="Search patterns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />

        <div className="flex flex-wrap gap-1.5">
          {presetCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase transition-all ${
                category === cat.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Patterns Grid */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-5 md:grid-cols-6 mb-4">
          {filteredPresets.map((preset) => {
            const isHovered = hoveredId === preset.id
            // Show first frame as static preview, animate only on hover
            const showFrames = isHovered && preset.frames.length > 1

            return (
              <button
                key={preset.id}
                onClick={() => handleSelect(preset)}
                onMouseEnter={() => setHoveredId(preset.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group flex flex-col items-center gap-1.5 focus:outline-none"
              >
                <div className="relative flex items-center justify-center p-1 transition-transform group-hover:scale-110">
                  <Matrix
                    rows={preset.size}
                    cols={preset.size}
                    pattern={showFrames ? undefined : preset.frames[0]}
                    frames={showFrames ? preset.frames : undefined}
                    fps={12}
                    loop
                    paused={!isHovered}
                    size={3}
                    gap={1}
                    palette={{ on: '#06b6d4', off: '#27272a' }}
                    glow={isHovered}
                  />
                </div>
                <span className="w-full truncate text-center font-mono text-[9px] tracking-tight text-zinc-400 group-hover:text-zinc-200">
                  {preset.name}
                </span>
              </button>
            )
          })}
        </div>

        {filteredPresets.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-zinc-400">
            No patterns found
          </div>
        )}
      </div>
    </div>
  )
}
