import { useState, memo } from 'react'
import {
  presets,
  presetCategories,
  type PresetPattern,
} from '../../data/presets'
import { Matrix } from '../ui/Matrix'
import { useLoadActions } from '../../stores/editorStore'
import { Search, Grid3x3, Activity } from 'lucide-react'

interface PresetPatternsProps {
  onPatternSelect?: () => void
}

export const PresetPatterns = memo(function PresetPatterns({
  onPatternSelect,
}: PresetPatternsProps) {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const { loadFrames } = useLoadActions()

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
      <div className="space-y-3 border-b border-[#e0ddd5] pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8a8a8a]" />
          <input
            type="text"
            placeholder="Search patterns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-[#e0ddd5] bg-white px-3 py-2.5 pl-9 text-xs text-[#2a2a2a] placeholder-[#8a8a8a] focus:border-[#0066cc]/50 focus:outline-none focus:shadow-sm transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {presetCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`rounded px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all border ${
                category === cat.id
                  ? 'border-[#0066cc] bg-[#e6f0ff] text-[#0066cc]'
                  : 'border-[#e0ddd5] bg-white text-[#8a8a8a] hover:border-[#d4d0c8] hover:text-[#6a6a6a]'
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
            const showFrames = isHovered && preset.frames.length > 1
            const isAnimated = preset.frames.length > 1

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelect(preset)}
                onMouseEnter={() => setHoveredId(preset.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group flex flex-col items-center gap-2 focus:outline-none"
              >
                <div
                  className="relative flex items-center justify-center p-2 rounded-lg border transition-all duration-200 group-hover:scale-105"
                  style={{
                    borderColor: isHovered ? '#0066cc' : '#e0ddd5',
                    background: isHovered ? '#e6f0ff' : 'transparent',
                    boxShadow: isHovered
                      ? '0 2px 8px rgba(0, 102, 204, 0.15)'
                      : 'none',
                  }}
                >
                  {/* Animated badge */}
                  {isAnimated && (
                    <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0066cc] text-white shadow-sm">
                      <Activity className="h-2.5 w-2.5" strokeWidth={3} />
                    </div>
                  )}

                  {/* Corner accents on hover */}
                  {isHovered && (
                    <>
                      <div className="absolute -top-0.5 -left-0.5 h-1.5 w-1.5 border-l border-t border-[#0066cc]" />
                      <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 border-r border-t border-[#0066cc]" />
                      <div className="absolute -bottom-0.5 -left-0.5 h-1.5 w-1.5 border-l border-b border-[#0066cc]" />
                      <div className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 border-r border-b border-[#0066cc]" />
                    </>
                  )}

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
                    palette={{ on: '#0066cc', off: '#f0efe9' }}
                    glow={isHovered}
                  />
                </div>
                <span className="w-full truncate text-center font-mono text-[8px] uppercase tracking-wider text-[#8a8a8a] group-hover:text-[#0066cc] transition-colors">
                  {preset.name}
                </span>
              </button>
            )
          })}
        </div>

        {filteredPresets.length === 0 && (
          <div className="flex h-32 items-center justify-center gap-2 text-[#8a8a8a]">
            <Grid3x3 className="h-4 w-4" />
            <span className="text-sm">No patterns found</span>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-[9px] font-mono text-[#8a8a8a] text-center uppercase tracking-wider">
        {filteredPresets.length} Pattern
        {filteredPresets.length !== 1 ? 's' : ''} Found
      </div>
    </div>
  )
})
