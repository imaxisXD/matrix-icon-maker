export type Frame = number[][]

export type EasingFunction = (t: number) => number
export type TweenEasing = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'smoothstep'

export const easingFunctions: Record<TweenEasing, EasingFunction> = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  smoothstep: (t: number) => t * t * (3 - 2 * t),
}

export function deepCloneFrame(frame: Frame): Frame {
  return frame.map((row) => [...row])
}

export function interpolateFrames(
  from: Frame,
  to: Frame,
  count: number,
  easing: EasingFunction
): Frame[] {
  const frames: Frame[] = []

  for (let i = 1; i <= count; i++) {
    const t = easing(i / (count + 1))
    const newFrame = from.map((row, r) =>
      row.map((val, c) => {
        const toVal = to[r]?.[c] ?? 0
        // Clamp result between 0 and 1
        return Math.max(0, Math.min(1, val + (toVal - val) * t))
      })
    )
    frames.push(newFrame)
  }

  return frames
}

export function generateTweenFrames(
  frames: Frame[],
  fromIndex: number,
  toIndex: number,
  count: number,
  easing: TweenEasing
): {
  tweenedFrames: Frame[]
  insertIndex: number
} {
  const from = frames[fromIndex]
  const to = frames[toIndex]

  const easingFn = easingFunctions[easing]
  const tweened = interpolateFrames(from, to, count, easingFn)

  return {
    tweenedFrames: tweened,
    insertIndex: fromIndex + 1,
  }
}

export function areFramesEqual(frame1: Frame, frame2: Frame): boolean {
  if (frame1.length !== frame2.length) return false

  for (let i = 0; i < frame1.length; i++) {
    const row1 = frame1[i]
    const row2 = frame2[i]
    if (row1.length !== row2.length) return false

    for (let j = 0; j < row1.length; j++) {
      if (Math.abs(row1[j] - row2[j]) > 0.001) return false
    }
  }

  return true
}
