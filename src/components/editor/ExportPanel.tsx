import { useState } from 'react'
import { Copy, Check, Download, Code, FileCode, Braces } from 'lucide-react'
import type { EditorStore } from '../../stores/editorStore'

interface ExportPanelProps {
  store: EditorStore
}

// Screw head component
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

function formatFrame(frame: number[][]): string {
  return `[\n${frame.map((row) => `  [${row.map((v) => v.toFixed(2).replace(/\.?0+$/, '') || '0').join(', ')}]`).join(',\n')}\n]`
}

function formatFrames(frames: number[][][]): string {
  return `[\n${frames
    .map((frame) =>
      formatFrame(frame)
        .split('\n')
        .map((l) => '  ' + l)
        .join('\n'),
    )
    .join(',\n')}\n]`
}

export function ExportPanel({ store }: ExportPanelProps) {
  const { state } = store
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  // Generate TypeScript pattern code
  const generatePatternCode = () => {
    const frame = state.frames[state.currentFrameIndex]
    return `const pattern: Frame = ${formatFrame(frame)};`
  }

  // Generate TypeScript frames code
  const generateFramesCode = () => {
    return `const frames: Frame[] = ${formatFrames(state.frames)};`
  }

  // Generate React component code
  const generateComponentCode = () => {
    const frame = state.frames[state.currentFrameIndex]

    return `import { Matrix, Frame } from "@/components/ui/Matrix";

const pattern: Frame = ${formatFrame(frame)};

export function CustomIcon({
  size = 6,
  gap = 1,
  animated = false
}: {
  size?: number;
  gap?: number;
  animated?: boolean;
}) {
  return (
    <Matrix
      rows={${state.gridSize.rows}}
      cols={${state.gridSize.cols}}
      pattern={pattern}
      size={size}
      gap={gap}
      palette={{
        on: "${state.palette.on}",
        off: "${state.palette.off}",
      }}
      glow={${state.glow}}
    />
  );
}`
  }

  // Generate SVG
  const generateSVG = () => {
    const frame = state.frames[state.currentFrameIndex]
    const { rows, cols } = state.gridSize
    const size = 10
    const gap = 2
    const width = cols * (size + gap) - gap
    const height = rows * (size + gap) - gap

    let circles = ''
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const value = frame[r]?.[c] ?? 0
        const x = c * (size + gap) + size / 2
        const y = r * (size + gap) + size / 2
        const color = value > 0.05 ? state.palette.on : state.palette.off
        const opacity = value > 0.05 ? value : 0.1
        circles += `  <circle cx="${x}" cy="${y}" r="${(size / 2) * 0.9}" fill="${color}" opacity="${opacity}" />\n`
      }
    }

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
${circles}</svg>`
  }

  const downloadSVG = () => {
    const svg = generateSVG()
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'matrix-icon.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-[#e0ddd5] bg-white shadow-sm">
      {/* Corner Screw Heads */}
      <ScrewHead className="absolute top-2 left-2 h-3 w-3 opacity-60" />
      <ScrewHead className="absolute top-2 right-2 h-3 w-3 opacity-60" />
      <ScrewHead className="absolute bottom-2 left-2 h-3 w-3 opacity-60" />
      <ScrewHead className="absolute bottom-2 right-2 h-3 w-3 opacity-60" />

      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#e0ddd5] px-4 py-3 bg-[#f8f7f4]/50">
        <FileCode className="h-4 w-4 text-[#7c3aed]" style={{ filter: 'drop-shadow(0 0 4px rgba(124, 58, 237, 0.3))' }} />
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2a2a2a]">
          Source Export
        </h3>
      </div>

      <div className="p-4">
        <div className="mb-4 grid grid-cols-2 gap-2">
          {/* Copy Pattern */}
          <button
            onClick={() => copyToClipboard(generatePatternCode(), 'pattern')}
            className="relative flex items-center justify-center gap-2 rounded border border-[#e0ddd5] bg-white py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] transition-all hover:border-[#0066cc]/50 hover:text-[#0066cc] hover:shadow-sm"
          >
            {copied === 'pattern' ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#00aa55]" />
                Copied
              </>
            ) : (
              <>
                <Braces className="h-3.5 w-3.5" />
                Pattern
              </>
            )}
          </button>

          {/* Copy Frames */}
          <button
            onClick={() => copyToClipboard(generateFramesCode(), 'frames')}
            className={`relative flex items-center justify-center gap-2 rounded border border-[#e0ddd5] bg-white py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
              state.frames.length > 1
                ? 'text-[#8a8a8a] hover:border-[#0066cc]/50 hover:text-[#0066cc] hover:shadow-sm'
                : 'cursor-not-allowed opacity-40'
            }`}
            disabled={state.frames.length <= 1}
          >
            {copied === 'frames' ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#00aa55]" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Frames
              </>
            )}
          </button>

          {/* Copy Component */}
          <button
            onClick={() => copyToClipboard(generateComponentCode(), 'component')}
            className="relative flex items-center justify-center gap-2 rounded border border-[#e0ddd5] bg-white py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] transition-all hover:border-[#0066cc]/50 hover:text-[#0066cc] hover:shadow-sm"
          >
            {copied === 'component' ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#00aa55]" />
                Copied
              </>
            ) : (
              <>
                <Code className="h-3.5 w-3.5" />
                Component
              </>
            )}
          </button>

          {/* Download SVG */}
          <button
            onClick={downloadSVG}
            className="relative flex items-center justify-center gap-2 rounded border border-[#e0ddd5] bg-white py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] transition-all hover:border-[#7c3aed]/50 hover:text-[#7c3aed] hover:shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            SVG
          </button>
        </div>

        {/* Code Preview */}
        <div className="relative overflow-hidden rounded border border-[#e0ddd5] bg-[#f8f7f4] p-3">
          {/* Language tag */}
          <div className="absolute right-0 top-0 rounded-bl border-b border-l border-[#e0ddd5] bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#8a8a8a]">
            TypeScript
          </div>
          <pre className="max-h-[150px] overflow-auto font-mono text-[10px] text-[#6a6a6a]">
            {generatePatternCode()}
          </pre>
        </div>
      </div>
    </div>
  )
}
