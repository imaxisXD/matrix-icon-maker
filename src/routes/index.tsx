import { createFileRoute, Link } from '@tanstack/react-router'
import { Matrix } from '../components/ui/Matrix'
import { presets } from '../data/presets'
import {
  ArrowRight,
  Sparkles,
  Layers,
  Download,
  Grid3X3,
  Terminal,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  // Sample animated patterns for hero
  const heroPatterns = presets.filter((p) => p.frames.length > 1).slice(0, 5)

  return (
    <div className="min-h-screen bg-zinc-50 font-mono">
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-32 overflow-hidden border-b border-zinc-200 bg-white">
        {/* Abstract Background Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            v1.0.0 Online
          </div>

          <h1 className="mb-8 text-6xl font-black tracking-tighter text-zinc-900 md:text-8xl">
            PIXEL<span className="text-zinc-300">MATRIX</span>
            <br />
            ENGINEER
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg text-zinc-500">
            Professional-grade LED matrix editor. Design, animate, and export
            pixel-perfect icons for your next hardware or software project.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/editor"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden bg-zinc-900 px-8 font-medium text-white transition-all hover:bg-zinc-800"
            >
              <span className="mr-2">LAUNCH EDITOR</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/patterns"
              className="group inline-flex h-12 items-center justify-center border border-zinc-200 bg-white px-8 font-medium text-zinc-900 transition-all hover:border-zinc-900"
            >
              <Grid3X3 className="mr-2 h-4 w-4" />
              BROWSE_PATTERNS
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 flex justify-center gap-6 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            {heroPatterns.map((pattern, i) => (
              <div
                key={pattern.id}
                className="relative bg-white p-2 shadow-xl ring-1 ring-zinc-900/5 transition-transform hover:-translate-y-2"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="border border-zinc-100 p-2">
                  <Matrix
                    rows={pattern.size}
                    cols={pattern.size}
                    frames={pattern.frames}
                    fps={12}
                    loop
                    size={4}
                    gap={1}
                    palette={{
                      on: '#18181b',
                      off: '#f4f4f5',
                    }}
                    glow={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-b border-zinc-200 bg-zinc-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 md:flex md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                SYSTEM_CAPABILITIES
              </h2>
              <p className="mt-2 text-zinc-500">
                Core features for pixel engineering
              </p>
            </div>
            <div className="hidden h-px w-32 bg-zinc-300 md:block" />
          </div>

          <div className="grid gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureItem
              icon={<Sparkles className="h-6 w-6" />}
              title="Matrix Glow"
              desc="Simulate LED diffusion with adjustable bloom filters."
            />
            <FeatureItem
              icon={<Layers className="h-6 w-6" />}
              title="Frame Sequencer"
              desc="Multi-frame animation timeline with FPS control."
            />
            <FeatureItem
              icon={<Terminal className="h-6 w-6" />}
              title="Code Export"
              desc="Generate optimized TypeScript/React component code."
            />
            <FeatureItem
              icon={<Download className="h-6 w-6" />}
              title="Vector Output"
              desc="Export pristine SVGs ready for implementation."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="group bg-white p-8 transition-colors hover:bg-zinc-50">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-900 shadow-sm group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="mb-2 font-bold text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-500">{desc}</p>
    </div>
  )
}
