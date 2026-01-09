import { Link } from '@tanstack/react-router'
import { Grid3X3, Palette, Layers, Github } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-zinc-900 bg-zinc-900 text-white transition-transform group-hover:scale-95">
              <Grid3X3 className="h-5 w-5" />
            </div>
            <div className="font-bold tracking-tight text-zinc-900">
              MATRIX<span className="text-zinc-400">.ICON</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/editor"
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
              activeProps={{ className: 'text-zinc-900' }}
            >
              [ EDITOR ]
            </Link>
            <Link
              to="/patterns"
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
              activeProps={{ className: 'text-zinc-900' }}
            >
              [ PATTERNS ]
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  )
}
