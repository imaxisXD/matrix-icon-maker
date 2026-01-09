import { useState } from 'react'
import { Copy, Check, Download, Code } from 'lucide-react'
import type { EditorStore } from '../../stores/editorStore'

interface ExportPanelProps {
  store: EditorStore
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
    <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-4 py-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
          Source Export
        </h3>
      </div>

      <div className="p-4">
        <div className="mb-4 grid grid-cols-2 gap-2">
          {/* Copy Pattern */}
          <button
            onClick={() => copyToClipboard(generatePatternCode(), 'pattern')}
            className="flex items-center justify-center gap-2 rounded border border-zinc-200 bg-white py-2 text-xs font-medium text-zinc-600 transition-all hover:border-zinc-400 hover:text-zinc-900"
          >
            {copied === 'pattern' ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            Copy Pattern
          </button>

          {/* Copy Frames (if animated) */}
          <button
            onClick={() => copyToClipboard(generateFramesCode(), 'frames')}
            className={`flex items-center justify-center gap-2 rounded border border-zinc-200 bg-white py-2 text-xs font-medium transition-all ${
              state.frames.length > 1
                ? 'text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
                : 'cursor-not-allowed opacity-50'
            }`}
            disabled={state.frames.length <= 1}
          >
            {copied === 'frames' ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            Copy Frames
          </button>

          {/* Copy Component */}
          <button
            onClick={() =>
              copyToClipboard(generateComponentCode(), 'component')
            }
            className="flex items-center justify-center gap-2 rounded border border-zinc-200 bg-white py-2 text-xs font-medium text-zinc-600 transition-all hover:border-zinc-400 hover:text-zinc-900"
          >
            {copied === 'component' ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Code className="h-3 w-3" />
            )}
            Copy Component
          </button>

          {/* Download SVG */}
          <button
            onClick={downloadSVG}
            className="flex items-center justify-center gap-2 rounded border border-zinc-200 bg-white py-2 text-xs font-medium text-zinc-600 transition-all hover:border-zinc-400 hover:text-zinc-900"
          >
            <Download className="h-3 w-3" />
            Download SVG
          </button>
        </div>

        {/* Code Preview */}
        <div className="relative overflow-hidden rounded border border-zinc-200 bg-zinc-50 p-3">
          <div className="absolute right-0 top-0 rounded-bl border-b border-l border-zinc-200 bg-white px-2 py-1 text-[9px] font-bold text-zinc-400">
            TYPESCRIPT
          </div>
          <pre className="max-h-[150px] overflow-auto font-mono text-[10px] text-zinc-600">
            {generatePatternCode()}
          </pre>
        </div>
      </div>
    </div>
  )
}
