import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Matrix } from '../components/ui/Matrix'
import { presets, presetCategories } from '../data/presets'
import { ArrowLeft, Copy, Check } from 'lucide-react'

export const Route = createFileRoute('/patterns')({ component: PatternsPage })

function PatternsPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const filteredPresets = presets.filter((preset) => {
    const matchesCategory = category === 'all' || preset.category === category
    const matchesSearch = preset.name
      .toLowerCase()
      .includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyPattern = async (preset: (typeof presets)[0]) => {
    const frame = preset.frames[0]
    const code = `const ${preset.id.replace(/-/g, '_')}: Frame = [\n${frame.map((row) => `  [${row.map((v) => v.toFixed(1)).join(', ')}]`).join(',\n')}\n];`
    await navigator.clipboard.writeText(code)
    setCopied(preset.id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-mono">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
              PATTERN_GALLERY
            </h1>
            <span className="text-sm font-medium text-zinc-400">
              {filteredPresets.length} items
            </span>
          </div>
          <p className="max-w-2xl text-lg text-zinc-500">
            A curated collection of pixel patterns. Click to copy source code.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {presetCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`rounded border px-4 py-2 text-xs font-bold uppercase transition-all ${
                  category === cat.id
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Filter patterns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-zinc-200 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        {/* Patterns Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredPresets.map((preset, i) => (
            <button
              key={preset.id}
              onClick={() => copyPattern(preset)}
              className="group relative flex flex-col items-center gap-4 rounded border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-zinc-900 hover:shadow-lg"
            >
              <div className="relative">
                <Matrix
                  rows={preset.size}
                  cols={preset.size}
                  frames={preset.frames}
                  fps={12}
                  loop
                  size={5}
                  gap={1}
                  palette={{
                    on: `hsl(${(i * 15 + 200) % 360}, 80%, 40%)`,
                    off: '#f4f4f5',
                  }}
                  glow={false}
                />

                {/* Status Badge */}
                {preset.frames.length > 1 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white">
                    A
                  </span>
                )}
              </div>

              <div className="w-full text-center">
                <span className="block truncate font-bold text-zinc-900">
                  {preset.name}
                </span>
                <span className="text-[10px] uppercase text-zinc-400">
                  {preset.category}
                </span>
              </div>

              {/* Copy Feedback Overlay */}
              {copied === preset.id && (
                <div className="absolute inset-0 flex items-center justify-center rounded bg-zinc-900/90 font-bold text-white">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-400" />
                    COPIED
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {filteredPresets.length === 0 && (
          <div className="rounded border border-zinc-200 bg-zinc-50 py-20 text-center text-zinc-500">
            No patterns found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
