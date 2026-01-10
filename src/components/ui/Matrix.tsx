'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

export type Frame = number[][]
type MatrixMode = 'default' | 'vu'

interface CellPosition {
  x: number
  y: number
}

interface MatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: number
  cols: number
  pattern?: Frame
  frames?: Frame[]
  fps?: number
  autoplay?: boolean
  loop?: boolean
  paused?: boolean
  size?: number
  gap?: number
  palette?: {
    on: string
    off: string
  }
  brightness?: number
  ariaLabel?: string
  onFrame?: (index: number) => void
  mode?: MatrixMode
  levels?: number[]
  glow?: boolean
  bloomIntensity?: number // 0-100
  fadeIntensity?: number // 0-100
  transitionSpeed?: 'slow' | 'normal' | 'fast'
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value))
}

function ensureFrameSize(frame: Frame, rows: number, cols: number): Frame {
  const result: Frame = []
  for (let r = 0; r < rows; r++) {
    const row = frame[r] || []
    result.push([])
    for (let c = 0; c < cols; c++) {
      result[r][c] = row[c] ?? 0
    }
  }
  return result
}

function useAnimation(
  frames: Frame[] | undefined,
  options: {
    fps: number
    autoplay: boolean
    loop: boolean
    paused?: boolean
    onFrame?: (index: number) => void
  },
): { frameIndex: number; isPlaying: boolean } {
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(options.autoplay)
  const frameIdRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)
  const accumulatorRef = useRef<number>(0)

  useEffect(() => {
    // Don't run animation if paused externally
    if (options.paused) {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
        frameIdRef.current = undefined
      }
      return
    }

    if (!frames || frames.length === 0 || !isPlaying) {
      return
    }

    const frameInterval = 1000 / options.fps

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime
      }

      const deltaTime = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime
      accumulatorRef.current += deltaTime

      if (accumulatorRef.current >= frameInterval) {
        accumulatorRef.current -= frameInterval

        setFrameIndex((prev) => {
          const next = prev + 1
          if (next >= frames.length) {
            if (options.loop) {
              options.onFrame?.(0)
              return 0
            } else {
              setIsPlaying(false)
              return prev
            }
          }
          options.onFrame?.(next)
          return next
        })
      }

      frameIdRef.current = requestAnimationFrame(animate)
    }

    frameIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [
    frames,
    isPlaying,
    options.fps,
    options.loop,
    options.onFrame,
    options.paused,
  ])

  useEffect(() => {
    setFrameIndex(0)
    setIsPlaying(options.autoplay)
    lastTimeRef.current = 0
    accumulatorRef.current = 0
  }, [frames, options.autoplay])

  return { frameIndex, isPlaying }
}

function emptyFrame(rows: number, cols: number): Frame {
  return Array.from({ length: rows }, () => Array(cols).fill(0))
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function vu(columns: number, levels: number[]): Frame {
  const rows = 7
  const frame = emptyFrame(rows, columns)

  for (let col = 0; col < Math.min(columns, levels.length); col++) {
    const level = Math.max(0, Math.min(1, levels[col]))
    const height = Math.floor(level * rows)

    for (let row = 0; row < rows; row++) {
      const rowFromBottom = rows - 1 - row
      if (rowFromBottom < height) {
        let brightness = 1
        if (row < rows * 0.3) {
          brightness = 1
        } else if (row < rows * 0.6) {
          brightness = 0.8
        } else {
          brightness = 0.6
        }
        frame[row][col] = brightness
      }
    }
  }

  return frame
}

export function Matrix({
  rows,
  cols,
  pattern,
  frames,
  fps = 12,
  autoplay = true,
  loop = true,
  paused = false,
  size = 10,
  gap = 2,
  palette = {
    on: 'currentColor',
    off: 'var(--color-muted, #374151)',
  },
  brightness = 1,
  ariaLabel,
  onFrame,
  mode = 'default',
  levels,
  glow = true,
  bloomIntensity = 75,
  fadeIntensity = 80,
  transitionSpeed = 'normal',
  className,
  ...props
}: MatrixProps) {
  // Generate unique IDs for SVG gradients and filters
  const instanceId = useId()
  const pixelOnId = `matrix-pixel-on-${instanceId}`
  const pixelOffId = `matrix-pixel-off-${instanceId}`
  const glowId = `matrix-glow-${instanceId}`

  const { frameIndex } = useAnimation(frames, {
    fps,
    autoplay: autoplay && !pattern,
    loop,
    paused,
    onFrame,
  })

  const currentFrame = useMemo(() => {
    if (mode === 'vu' && levels && levels.length > 0) {
      return ensureFrameSize(vu(cols, levels), rows, cols)
    }

    if (pattern) {
      return ensureFrameSize(pattern, rows, cols)
    }

    if (frames && frames.length > 0) {
      return ensureFrameSize(frames[frameIndex] || frames[0], rows, cols)
    }

    return ensureFrameSize([], rows, cols)
  }, [pattern, frames, frameIndex, rows, cols, mode, levels])

  const cellPositions = useMemo(() => {
    const positions: CellPosition[][] = []

    for (let row = 0; row < rows; row++) {
      positions[row] = []
      for (let col = 0; col < cols; col++) {
        positions[row][col] = {
          x: col * (size + gap),
          y: row * (size + gap),
        }
      }
    }

    return positions
  }, [rows, cols, size, gap])

  const svgDimensions = useMemo(() => {
    return {
      width: cols * (size + gap) - gap,
      height: rows * (size + gap) - gap,
    }
  }, [rows, cols, size, gap])

  const isAnimating = !pattern && frames && frames.length > 0

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? 'matrix display'}
      aria-live={isAnimating ? 'polite' : undefined}
      className={cn('relative inline-block', className)}
      style={
        {
          '--matrix-on': palette.on,
          '--matrix-off': palette.off,
          '--matrix-gap': `${gap}px`,
          '--matrix-size': `${size}px`,
        } as React.CSSProperties
      }
      {...props}
    >
      <svg
        width={svgDimensions.width}
        height={svgDimensions.height}
        viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Enhanced radial gradient with more gradual multi-stop opacity fading */}
          <radialGradient id={pixelOnId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--matrix-on)" stopOpacity="1" />
            <stop
              offset="15%"
              stopColor="var(--matrix-on)"
              stopOpacity="0.98"
            />
            <stop
              offset="30%"
              stopColor="var(--matrix-on)"
              stopOpacity="0.92"
            />
            <stop
              offset="45%"
              stopColor="var(--matrix-on)"
              stopOpacity="0.82"
            />
            <stop
              offset="60%"
              stopColor="var(--matrix-on)"
              stopOpacity="0.68"
            />
            <stop
              offset="75%"
              stopColor="var(--matrix-on)"
              stopOpacity="0.50"
            />
            <stop
              offset="88%"
              stopColor="var(--matrix-on)"
              stopOpacity="0.30"
            />
            <stop
              offset="100%"
              stopColor="var(--matrix-on)"
              stopOpacity="0.15"
            />
          </radialGradient>

          {/* Off state gradient with subtle fade */}
          <radialGradient id={pixelOffId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--matrix-off)" stopOpacity="0.8" />
            <stop
              offset="40%"
              stopColor="var(--matrix-off)"
              stopOpacity="0.5"
            />
            <stop
              offset="70%"
              stopColor="var(--matrix-off)"
              stopOpacity="0.25"
            />
            <stop
              offset="100%"
              stopColor="var(--matrix-off)"
              stopOpacity="0.08"
            />
          </radialGradient>

          {/* Enhanced bloom filter with multiple blur layers */}
          {glow && (
            <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
              {/* Inner bright core */}
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="1"
                result="blur1"
              />
              {/* Medium bloom spread */}
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="3"
                result="blur2"
              />
              {/* Outer soft bloom */}
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="6"
                result="blur3"
              />
              {/* Far outer glow haze */}
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur4"
              />

              {/* Merge all bloom layers */}
              <feMerge>
                <feMergeNode in="blur4" />
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        <style>
          {`
            .matrix-pixel {
              transition: 
                opacity ${transitionSpeed === 'slow' ? '600ms' : transitionSpeed === 'fast' ? '250ms' : '450ms'} cubic-bezier(0.4, 0, 0.2, 1),
                transform ${transitionSpeed === 'slow' ? '300ms' : transitionSpeed === 'fast' ? '100ms' : '200ms'} cubic-bezier(0.4, 0, 0.2, 1),
                filter ${transitionSpeed === 'slow' ? '500ms' : transitionSpeed === 'fast' ? '200ms' : '350ms'} ease-out;
              transform-origin: center;
              transform-box: fill-box;
            }
            
            /* CSS-only bloom effect using drop-shadow layers - scaled by bloomIntensity */
            .matrix-pixel-active-${instanceId} {
              ${
                glow && bloomIntensity > 0
                  ? `filter: url(#${glowId}) 
                drop-shadow(0 0 ${Math.round((2 * bloomIntensity) / 100)}px var(--matrix-on))
                drop-shadow(0 0 ${Math.round((4 * bloomIntensity) / 100)}px var(--matrix-on))
                drop-shadow(0 0 ${Math.round((8 * bloomIntensity) / 100)}px var(--matrix-on))
                drop-shadow(0 0 ${Math.round((16 * bloomIntensity) / 100)}px var(--matrix-on));`
                  : ''
              }
            }
            
            /* Medium intensity bloom */
            .matrix-pixel-medium-${instanceId} {
              ${
                glow && bloomIntensity > 0
                  ? `filter: 
                drop-shadow(0 0 ${Math.round((1 * bloomIntensity) / 100)}px var(--matrix-on))
                drop-shadow(0 0 ${Math.round((3 * bloomIntensity) / 100)}px var(--matrix-on))
                drop-shadow(0 0 ${Math.round((6 * bloomIntensity) / 100)}px var(--matrix-on));`
                  : ''
              }
            }
            
            /* Low intensity with subtle fade */
            .matrix-pixel-low-${instanceId} {
              ${
                glow && bloomIntensity > 0
                  ? `filter: 
                drop-shadow(0 0 ${Math.round((1 * bloomIntensity) / 100)}px var(--matrix-on))
                drop-shadow(0 0 ${Math.round((2 * bloomIntensity) / 100)}px var(--matrix-on));`
                  : ''
              }
            }
            
            /* Fading out animation state */
            .matrix-pixel-fading-${instanceId} {
              opacity: ${((100 - fadeIntensity) / 100) * 0.15};
              transition: opacity ${transitionSpeed === 'slow' ? '800ms' : transitionSpeed === 'fast' ? '300ms' : '600ms'} cubic-bezier(0.4, 0, 0.2, 1);
            }
          `}
        </style>

        {currentFrame.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const pos = cellPositions[rowIndex]?.[colIndex]
            if (!pos) return null

            const opacity = clamp(brightness * value)
            // Tiered intensity levels for bloom effects
            const isHighIntensity = opacity > 0.7
            const isMediumIntensity = opacity > 0.3 && opacity <= 0.7
            const isLowIntensity = opacity > 0.05 && opacity <= 0.3
            const isOn = opacity > 0.05
            const fill = isOn ? `url(#${pixelOnId})` : `url(#${pixelOffId})`

            // Scale varies with intensity for more dramatic effect
            const scale = isHighIntensity ? 1.15 : isMediumIntensity ? 1.08 : 1
            const radius = (size / 2) * 0.9

            // Determine which bloom class to apply based on intensity
            const getBloomClass = () => {
              if (isHighIntensity) return `matrix-pixel-active-${instanceId}`
              if (isMediumIntensity) return `matrix-pixel-medium-${instanceId}`
              if (isLowIntensity) return `matrix-pixel-low-${instanceId}`
              return ''
            }

            return (
              <circle
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'matrix-pixel',
                  getBloomClass(),
                  !isOn && 'opacity-20',
                )}
                cx={pos.x + size / 2}
                cy={pos.y + size / 2}
                r={radius}
                fill={fill}
                opacity={isOn ? opacity : 0.08}
                style={{
                  transform: `scale(${scale})`,
                }}
              />
            )
          }),
        )}
      </svg>
    </div>
  )
}

// Utility to create empty frame
export { emptyFrame }
