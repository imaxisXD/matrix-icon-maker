'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

export type Frame = number[][]

export type OnionSkinLayer = {
  frame: Frame
  opacity: number
  type: 'previous' | 'next'
}

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
  onionSkinLayers?: OnionSkinLayer[]
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

  // Store onFrame in a ref to avoid unnecessary effect re-renders
  const onFrameRef = useRef(options.onFrame)
  useEffect(() => {
    onFrameRef.current = options.onFrame
  }, [options.onFrame])

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
              onFrameRef.current?.(0)
              return 0
            } else {
              setIsPlaying(false)
              return prev
            }
          }
          onFrameRef.current?.(next)
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
  }, [frames, isPlaying, options.fps, options.loop, options.paused])

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
  bloomIntensity = 30,
  fadeIntensity = 50,
  transitionSpeed = 'normal',
  onionSkinLayers = [],
  className,
  ...props
}: MatrixProps) {
  // Generate unique IDs for SVG gradients and filters
  const instanceId = useId()
  const pixelOnId = `matrix-pixel-on-${instanceId}`
  const pixelOffId = `matrix-pixel-off-${instanceId}`
  const glowId = `matrix-glow-${instanceId}`
  const onionSkinPrevId = `matrix-onion-prev-${instanceId}`
  const onionSkinNextId = `matrix-onion-next-${instanceId}`

  const { frameIndex } = useAnimation(frames, {
    fps,
    autoplay: autoplay && !pattern,
    loop,
    paused,
    onFrame,
  })

  // Memoize the current frame with stable references
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
  }, [mode, levels, cols, rows, pattern, frames, frameIndex])

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

  // Memoize transition durations based on transitionSpeed prop
  const transitionDurations = useMemo(() => {
    const durations = {
      slow: { opacity: '600ms', transform: '300ms', filter: '500ms' },
      normal: { opacity: '450ms', transform: '200ms', filter: '350ms' },
      fast: { opacity: '250ms', transform: '100ms', filter: '200ms' },
    }
    return durations[transitionSpeed]
  }, [transitionSpeed])

  // Build transition string once
  const transitionString = useMemo(() => {
    return `opacity ${transitionDurations.opacity} cubic-bezier(0.4, 0, 0.2, 1), transform ${transitionDurations.transform} cubic-bezier(0.4, 0, 0.2, 1), filter ${transitionDurations.filter} ease-out`
  }, [transitionDurations])

  // Pre-compute filter style strings for reuse
  const filterStyles = useMemo(() => {
    if (!glow || bloomIntensity <= 0) {
      return {
        high: 'none',
        medium: 'none',
        low: 'none',
        none: 'none',
      }
    }
    return {
      high: `url(#${glowId}) drop-shadow(0 0 ${Math.round((2 * bloomIntensity) / 100)}px var(--matrix-on)) drop-shadow(0 0 ${Math.round((4 * bloomIntensity) / 100)}px var(--matrix-on)) drop-shadow(0 0 ${Math.round((8 * bloomIntensity) / 100)}px var(--matrix-on)) drop-shadow(0 0 ${Math.round((16 * bloomIntensity) / 100)}px var(--matrix-on))`,
      medium: `drop-shadow(0 0 ${Math.round((1 * bloomIntensity) / 100)}px var(--matrix-on)) drop-shadow(0 0 ${Math.round((3 * bloomIntensity) / 100)}px var(--matrix-on)) drop-shadow(0 0 ${Math.round((6 * bloomIntensity) / 100)}px var(--matrix-on))`,
      low: `drop-shadow(0 0 ${Math.round((1 * bloomIntensity) / 100)}px var(--matrix-on)) drop-shadow(0 0 ${Math.round((2 * bloomIntensity) / 100)}px var(--matrix-on))`,
      none: 'none',
    }
  }, [glow, bloomIntensity, glowId])

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

          {/* Onion skin gradient for previous frame (desaturated, warm tint) */}
          <radialGradient id={onionSkinPrevId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--matrix-on)" stopOpacity="0.6" />
            <stop offset="40%" stopColor="var(--matrix-on)" stopOpacity="0.4" />
            <stop offset="70%" stopColor="var(--matrix-on)" stopOpacity="0.2" />
            <stop
              offset="100%"
              stopColor="var(--matrix-on)"
              stopOpacity="0.05"
            />
          </radialGradient>

          {/* Onion skin gradient for next frame (cool tint, cyan shift) */}
          <radialGradient id={onionSkinNextId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--matrix-on)" stopOpacity="0.5" />
            <stop offset="40%" stopColor="var(--matrix-on)" stopOpacity="0.3" />
            <stop
              offset="70%"
              stopColor="var(--matrix-on)"
              stopOpacity="0.15"
            />
            <stop
              offset="100%"
              stopColor="var(--matrix-on)"
              stopOpacity="0.03"
            />
          </radialGradient>

          {/* Enhanced bloom filter with multiple blur layers - scaled by bloomIntensity */}
          {glow && bloomIntensity > 0 && (
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              {/* Inner bright core */}
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={0.5 * (bloomIntensity / 100)}
                result="blur1"
              />
              {/* Medium bloom spread */}
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={1.5 * (bloomIntensity / 100)}
                result="blur2"
              />
              {/* Outer soft bloom */}
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={3 * (bloomIntensity / 100)}
                result="blur3"
              />

              {/* Merge bloom layers */}
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}

          {/* Static CSS stylesheet - only created once per component mount */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .matrix-pixel {
                transform-origin: center;
                transform-box: fill-box;
              }

              .matrix-pixel-fading {
                opacity: var(--matrix-fade-opacity, 0.075);
                transition: opacity var(--matrix-fade-transition, 600ms) cubic-bezier(0.4, 0, 0.2, 1);
              }

              .onion-skin-layer {
                pointer-events: none;
              }

              .onion-skin-previous {
                filter: grayscale(0.5) sepia(0.15);
              }

              .onion-skin-next {
                filter: hue-rotate(160deg) grayscale(0.3) saturate(1.2);
              }
            `,
            }}
          />
        </defs>

        {/* Onion skin layers - rendered before main frame (skip if empty) */}
        {onionSkinLayers.length > 0 && (
          <g className="onion-skin-layer" style={{ pointerEvents: 'none' }}>
            {onionSkinLayers.map((layer, layerIndex) => {
              const layerFrame = ensureFrameSize(layer.frame, rows, cols)
              const gradientId =
                layer.type === 'previous' ? onionSkinPrevId : onionSkinNextId
              const layerClass =
                layer.type === 'previous'
                  ? 'onion-skin-previous'
                  : 'onion-skin-next'

              return layerFrame.map((row, rowIndex) =>
                row.map((value, colIndex) => {
                  const pos = cellPositions[rowIndex]?.[colIndex]
                  if (!pos || value <= 0.01) return null

                  const opacity = clamp(layer.opacity * value)
                  const scale = opacity > 0.7 ? 1.1 : opacity > 0.3 ? 1.05 : 1
                  const radius = (size / 2) * 0.85

                  return (
                    <circle
                      key={`onion-${layer.type}-${layerIndex}-${rowIndex}-${colIndex}`}
                      className={layerClass}
                      cx={pos.x + size / 2}
                      cy={pos.y + size / 2}
                      r={radius}
                      fill={`url(#${gradientId})`}
                      opacity={opacity}
                      style={{
                        transform: `scale(${scale})`,
                        transition: transitionString,
                      }}
                    />
                  )
                }),
              )
            })}
          </g>
        )}

        {/* Main frame pixels */}
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

            // Get filter style from pre-computed values
            const filterStyle = isHighIntensity
              ? filterStyles.high
              : isMediumIntensity
                ? filterStyles.medium
                : isLowIntensity
                  ? filterStyles.low
                  : filterStyles.none

            return (
              <circle
                key={`${rowIndex}-${colIndex}`}
                className={cn('matrix-pixel', !isOn && 'opacity-20')}
                cx={pos.x + size / 2}
                cy={pos.y + size / 2}
                r={radius}
                fill={fill}
                opacity={isOn ? opacity : 0.08}
                style={{
                  transform: `scale(${scale})`,
                  filter: filterStyle,
                  transition: transitionString,
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
