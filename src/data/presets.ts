import type { Frame } from '../components/ui/Matrix'

// Helper to create empty frame
function emptyFrame(rows: number, cols: number): Frame {
  return Array.from({ length: rows }, () => Array(cols).fill(0))
}

// ============================================================================
// STATIC PATTERNS
// ============================================================================

export const cross: Frame = [
  [0, 0, 0, 0.3, 1, 0.3, 0, 0, 0],
  [0, 0, 0.3, 1, 1, 1, 0.3, 0, 0],
  [0, 0.3, 1, 1, 1, 1, 1, 0.3, 0],
  [0.3, 1, 1, 1, 1, 1, 1, 1, 0.3],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0.3, 1, 1, 1, 1, 1, 1, 1, 0.3],
  [0, 0.3, 1, 1, 1, 1, 1, 0.3, 0],
  [0, 0, 0.3, 1, 1, 1, 0.3, 0, 0],
  [0, 0, 0, 0.3, 1, 0.3, 0, 0, 0],
]

export const xShape: Frame = [
  [1, 0.5, 0, 0, 0, 0, 0, 0.5, 1],
  [0.5, 1, 0.5, 0, 0, 0, 0.5, 1, 0.5],
  [0, 0.5, 1, 0.5, 0, 0.5, 1, 0.5, 0],
  [0, 0, 0.5, 1, 0.5, 1, 0.5, 0, 0],
  [0, 0, 0, 0.5, 1, 0.5, 0, 0, 0],
  [0, 0, 0.5, 1, 0.5, 1, 0.5, 0, 0],
  [0, 0.5, 1, 0.5, 0, 0.5, 1, 0.5, 0],
  [0.5, 1, 0.5, 0, 0, 0, 0.5, 1, 0.5],
  [1, 0.5, 0, 0, 0, 0, 0, 0.5, 1],
]

export const diamond: Frame = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0.5, 1, 0.5, 0, 0, 0],
  [0, 0, 0.5, 1, 1, 1, 0.5, 0, 0],
  [0, 0.5, 1, 1, 1, 1, 1, 0.5, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0.5, 1, 1, 1, 1, 1, 0.5, 0],
  [0, 0, 0.5, 1, 1, 1, 0.5, 0, 0],
  [0, 0, 0, 0.5, 1, 0.5, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
]

export const corners: Frame = [
  [1, 1, 0, 0, 0, 0, 0, 1, 1],
  [1, 0.5, 0, 0, 0, 0, 0, 0.5, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0.5, 0, 0, 0, 0, 0, 0.5, 1],
  [1, 1, 0, 0, 0, 0, 0, 1, 1],
]

export const checkerboard: Frame = [
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
]

// ============================================================================
// NEW GEOMETRIC PATTERNS (Reference Style)
// ============================================================================

// --- Points ---
export const soloCenter: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === 4 && c === 4 ? 1 : 0)),
)

export const soloTl: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === 0 && c === 0 ? 1 : 0)),
)

export const soloBr: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === 8 && c === 8 ? 1 : 0)),
)

// --- Lines ---
export const lineHTop: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === 0 ? 1 : 0)),
)

export const lineHMid: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === 4 ? 1 : 0)),
)

export const lineHBot: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === 8 ? 1 : 0)),
)

export const lineVLeft: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (c === 0 ? 1 : 0)),
)

export const lineVMid: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (c === 4 ? 1 : 0)),
)

export const lineVRight: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (c === 8 ? 1 : 0)),
)

export const lineDiag1: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === c ? 1 : 0)),
)

export const lineDiag2: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === 8 - c ? 1 : 0)),
)

// --- Shapes ---
export const cornersOnly: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => ((r === 0 || r === 8) && (c === 0 || c === 8) ? 1 : 0)),
)

export const square1: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r >= 3 && r <= 5 && c >= 3 && c <= 5 ? 1 : 0)),
)

export const square2: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) =>
    (r >= 2 && r <= 6 && (c === 2 || c === 6)) ||
    (c >= 2 && c <= 6 && (r === 2 || r === 6))
      ? 1
      : 0,
  ),
)

// L Shapes
export const lTl: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => ((r === 0 && c <= 4) || (c === 0 && r <= 4) ? 1 : 0)),
)

export const lTr: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => ((r === 0 && c >= 4) || (c === 8 && r <= 4) ? 1 : 0)),
)

export const lBl: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => ((r === 8 && c <= 4) || (c === 0 && r >= 4) ? 1 : 0)),
)

export const lBr: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => ((r === 8 && c >= 4) || (c === 8 && r >= 4) ? 1 : 0)),
)

// T Shapes
export const tTop: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === 0 || (c === 4 && r <= 4) ? 1 : 0)),
)

export const tBot: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === 8 || (c === 4 && r >= 4) ? 1 : 0)),
)

// Frames
export const frameOuter: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) => (r === 0 || r === 8 || c === 0 || c === 8 ? 1 : 0)),
)

export const frameInner: Frame = emptyFrame(9, 9).map((row, r) =>
  row.map((_, c) =>
    (r === 2 || r === 6 || c === 2 || c === 6) &&
    r >= 2 &&
    r <= 6 &&
    c >= 2 &&
    c <= 6
      ? 1
      : 0,
  ),
)

export const rowsAlt: Frame = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
]

export const stripesH: Frame = [
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
]

export const stripesV: Frame = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

// ============================================================================
// ANIMATED PATTERN GENERATORS
// ============================================================================

export function generateWaveLR(size = 9, steps = 12): Frame[] {
  const frames: Frame[] = []
  for (let step = 0; step < steps; step++) {
    const frame = emptyFrame(size, size)
    const pos = (step / steps) * size
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const dist = Math.abs(col - pos)
        frame[row][col] = Math.max(0, 1 - dist / 3)
      }
    }
    frames.push(frame)
  }
  return frames
}

export function generateWaveRL(size = 9, steps = 12): Frame[] {
  const frames = generateWaveLR(size, steps)
  return frames.reverse()
}

export function generateWaveTB(size = 9, steps = 12): Frame[] {
  const frames: Frame[] = []
  for (let step = 0; step < steps; step++) {
    const frame = emptyFrame(size, size)
    const pos = (step / steps) * size
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const dist = Math.abs(row - pos)
        frame[row][col] = Math.max(0, 1 - dist / 3)
      }
    }
    frames.push(frame)
  }
  return frames
}

export function generateWaveBT(size = 9, steps = 12): Frame[] {
  const frames = generateWaveTB(size, steps)
  return frames.reverse()
}

export function generateDiagonalTL(size = 9, steps = 16): Frame[] {
  const frames: Frame[] = []
  const maxDist = (size - 1) * 2
  for (let step = 0; step < steps; step++) {
    const frame = emptyFrame(size, size)
    const pos = (step / steps) * maxDist
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const dist = Math.abs(row + col - pos)
        frame[row][col] = Math.max(0, 1 - dist / 3)
      }
    }
    frames.push(frame)
  }
  return frames
}

export function generateDiagonalTR(size = 9, steps = 16): Frame[] {
  const frames: Frame[] = []
  const maxDist = (size - 1) * 2
  for (let step = 0; step < steps; step++) {
    const frame = emptyFrame(size, size)
    const pos = (step / steps) * maxDist
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const dist = Math.abs(row + (size - 1 - col) - pos)
        frame[row][col] = Math.max(0, 1 - dist / 3)
      }
    }
    frames.push(frame)
  }
  return frames
}

export function generateDiagonalBL(size = 9, steps = 16): Frame[] {
  return generateDiagonalTR(size, steps).reverse()
}

export function generateDiagonalBR(size = 9, steps = 16): Frame[] {
  return generateDiagonalTL(size, steps).reverse()
}

export function generateRippleOut(size = 9, steps = 12): Frame[] {
  const frames: Frame[] = []
  const center = (size - 1) / 2
  const maxDist = Math.sqrt(2) * center
  for (let step = 0; step < steps; step++) {
    const frame = emptyFrame(size, size)
    const radius = (step / steps) * maxDist * 1.5
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const dist = Math.sqrt(
          Math.pow(row - center, 2) + Math.pow(col - center, 2),
        )
        const ringDist = Math.abs(dist - radius)
        frame[row][col] = Math.max(0, 1 - ringDist / 2)
      }
    }
    frames.push(frame)
  }
  return frames
}

export function generateRippleIn(size = 9, steps = 12): Frame[] {
  return generateRippleOut(size, steps).reverse()
}

export function generateSpiralCW(size = 9, steps = 20): Frame[] {
  const frames: Frame[] = []
  const center = (size - 1) / 2
  for (let step = 0; step < steps; step++) {
    const frame = emptyFrame(size, size)
    const angle = (step / steps) * Math.PI * 2
    const maxRadius = (size - 1) / 2
    for (let radius = 0; radius <= maxRadius; radius += 0.5) {
      const spiralAngle = angle + radius * 0.5
      const x = Math.round(center + radius * Math.cos(spiralAngle))
      const y = Math.round(center + radius * Math.sin(spiralAngle))
      if (x >= 0 && x < size && y >= 0 && y < size) {
        frame[y][x] = 1
      }
    }
    frames.push(frame)
  }
  return frames
}

export function generateSpiralCCW(size = 9, steps = 20): Frame[] {
  const frames = generateSpiralCW(size, steps)
  return frames.reverse()
}

export function generateSnake(size = 9, steps = 20): Frame[] {
  const frames: Frame[] = []
  const path: [number, number][] = []

  // Generate snake path
  for (let row = 0; row < size; row++) {
    if (row % 2 === 0) {
      for (let col = 0; col < size; col++) {
        path.push([row, col])
      }
    } else {
      for (let col = size - 1; col >= 0; col--) {
        path.push([row, col])
      }
    }
  }

  const headLength = Math.ceil(path.length / 3)
  for (let step = 0; step < steps; step++) {
    const frame = emptyFrame(size, size)
    const headPos = Math.floor((step / steps) * (path.length + headLength))

    for (let i = 0; i < headLength; i++) {
      const idx = headPos - i
      if (idx >= 0 && idx < path.length) {
        const [row, col] = path[idx]
        frame[row][col] = 1 - (i / headLength) * 0.7
      }
    }
    frames.push(frame)
  }
  return frames
}

export function generateSnakeRev(size = 9, steps = 20): Frame[] {
  return generateSnake(size, steps).reverse()
}

export function generateRain(size = 9, steps = 12): Frame[] {
  const frames: Frame[] = []
  for (let step = 0; step < steps; step++) {
    const frame = emptyFrame(size, size)
    for (let col = 0; col < size; col++) {
      const offset = (col % 3) * 2
      const row = (step + offset) % size
      frame[row][col] = 1
      if (row > 0) frame[row - 1][col] = 0.5
      if (row > 1) frame[row - 2][col] = 0.2
    }
    frames.push(frame)
  }
  return frames
}

export function generateRainRev(size = 9, steps = 12): Frame[] {
  return generateRain(size, steps).reverse()
}

export function generatePulse(pattern: Frame, steps = 12): Frame[] {
  const frames: Frame[] = []
  for (let step = 0; step < steps; step++) {
    const phase = (step / steps) * Math.PI * 2
    const intensity = (Math.sin(phase) + 1) / 2
    const brightness = 0.3 + intensity * 0.7
    const frame = pattern.map((row) =>
      row.map((cell) => (cell > 0 ? cell * brightness : 0)),
    )
    frames.push(frame)
  }
  return frames
}

// ============================================================================
// ANIMATION HELPERS
// ============================================================================

export function generateShift(
  frame: Frame,
  direction: 'up' | 'down' | 'left' | 'right',
  steps = 9,
): Frame[] {
  const frames: Frame[] = []
  const size = frame.length

  for (let s = 0; s < steps; s++) {
    const newFrame = emptyFrame(size, size)
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        let srcR = r
        let srcC = c

        if (direction === 'up') srcR = (r + s) % size
        if (direction === 'down') srcR = (r - s + size) % size
        if (direction === 'left') srcC = (c + s) % size
        if (direction === 'right') srcC = (c - s + size) % size

        newFrame[r][c] = frame[srcR][srcC]
      }
    }
    frames.push(newFrame)
  }
  return frames
}

export function generateRotate(frame: Frame, steps = 4): Frame[] {
  const frames: Frame[] = [frame]
  let current = frame

  for (let i = 1; i < steps; i++) {
    const next = emptyFrame(frame.length, frame.length)
    // Rotate 90 degrees clockwise
    for (let r = 0; r < frame.length; r++) {
      for (let c = 0; c < frame.length; c++) {
        next[c][frame.length - 1 - r] = current[r][c]
      }
    }
    frames.push(next)
    current = next
  }
  return frames
}

export function generateMarchingBorder(size = 9, steps = 12): Frame[] {
  const frames: Frame[] = []
  for (let s = 0; s < steps; s++) {
    const frame = emptyFrame(size, size)
    // Perimeter length approx size*4 - 4
    const perimeter = (size - 1) * 4

    for (let i = 0; i < perimeter; i++) {
      // Calculate position based on index walking around perimeter
      let r = 0,
        c = 0
      if (i < size - 1) {
        // Top edge
        r = 0
        c = i
      } else if (i < (size - 1) * 2) {
        // Right edge
        r = i - (size - 1)
        c = size - 1
      } else if (i < (size - 1) * 3) {
        // Bottom edge
        r = size - 1
        c = (size - 1) * 3 - i // walking left
      } else {
        // Left edge
        r = (size - 1) * 4 - i
        c = 0 // walking up
      }

      // Dash pattern: 3 on, 1 off (or similar)
      const val = (i - s) % 4 === 0 ? 1 : 0.2
      frame[r][c] = val
    }
    frames.push(frame)
  }
  return frames
}

export function generateBlink(frame: Frame, steps = 12): Frame[] {
  const frames: Frame[] = []
  for (let s = 0; s < steps; s++) {
    const brightness = s < steps / 2 ? 1 : 0.2
    frames.push(
      frame.map((row) => row.map((cell) => (cell > 0 ? brightness : 0))),
    )
  }
  return frames
}

// ============================================================================
// PRESET COLLECTION
// ============================================================================

export interface PresetPattern {
  id: string
  name: string
  category:
    | 'static'
    | 'wave'
    | 'diagonal'
    | 'ripple'
    | 'spiral'
    | 'points'
    | 'lines'
    | 'shapes'
    | 'frames'
    | 'other'
  frames: Frame[]
  size: number
}

export const presets: PresetPattern[] = [
  // --- Points (Pulse) ---
  {
    id: 'solo-center',
    name: 'solo-center',
    category: 'points',
    frames: generatePulse(soloCenter),
    size: 9,
  },
  {
    id: 'solo-tl',
    name: 'solo-tl',
    category: 'points',
    frames: generateBlink(soloTl),
    size: 9,
  },
  {
    id: 'solo-br',
    name: 'solo-br',
    category: 'points',
    frames: generateBlink(soloBr),
    size: 9,
  },

  // --- Lines (Flow) ---
  {
    id: 'line-h-top',
    name: 'line-h-top',
    category: 'lines',
    frames: generateShift(lineHTop, 'right'),
    size: 9,
  },
  {
    id: 'line-h-mid',
    name: 'line-h-mid',
    category: 'lines',
    frames: generateShift(lineHMid, 'left'),
    size: 9,
  },
  {
    id: 'line-h-bot',
    name: 'line-h-bot',
    category: 'lines',
    frames: generateShift(lineHBot, 'right'),
    size: 9,
  },
  {
    id: 'line-v-left',
    name: 'line-v-left',
    category: 'lines',
    frames: generateShift(lineVLeft, 'down'),
    size: 9,
  },
  {
    id: 'line-v-mid',
    name: 'line-v-mid',
    category: 'lines',
    frames: generateShift(lineVMid, 'up'),
    size: 9,
  },
  {
    id: 'line-v-right',
    name: 'line-v-right',
    category: 'lines',
    frames: generateShift(lineVRight, 'down'),
    size: 9,
  },
  {
    id: 'line-diag-1',
    name: 'line-diag-1',
    category: 'lines',
    frames: generateShift(lineDiag1, 'right'),
    size: 9,
  },
  {
    id: 'line-diag-2',
    name: 'line-diag-2',
    category: 'lines',
    frames: generateShift(lineDiag2, 'left'),
    size: 9,
  },

  // --- Shapes (Rotate/Pulse) ---
  {
    id: 'corners-only',
    name: 'corners-only',
    category: 'shapes',
    frames: generateRotate(cornersOnly),
    size: 9,
  },
  {
    id: 'square-1',
    name: 'square-1',
    category: 'shapes',
    frames: generatePulse(square1),
    size: 9,
  },
  {
    id: 'square-2',
    name: 'square-2',
    category: 'shapes',
    frames: generateRotate(square2),
    size: 9,
  },
  {
    id: 'l-tl',
    name: 'l-tl',
    category: 'shapes',
    frames: generateRotate(lTl),
    size: 9,
  },
  {
    id: 'l-tr',
    name: 'l-tr',
    category: 'shapes',
    frames: generateRotate(lTr),
    size: 9,
  },
  {
    id: 'l-bl',
    name: 'l-bl',
    category: 'shapes',
    frames: generateRotate(lBl),
    size: 9,
  },
  {
    id: 'l-br',
    name: 'l-br',
    category: 'shapes',
    frames: generateRotate(lBr),
    size: 9,
  },
  {
    id: 't-top',
    name: 't-top',
    category: 'shapes',
    frames: generateRotate(tTop),
    size: 9,
  },
  {
    id: 't-bot',
    name: 't-bot',
    category: 'shapes',
    frames: generateRotate(tBot),
    size: 9,
  },

  // --- Frames (Marching) ---
  {
    id: 'frame-outer',
    name: 'frame-outer',
    category: 'frames',
    frames: generateMarchingBorder(9),
    size: 9,
  },
  {
    id: 'frame-inner',
    name: 'frame-inner',
    category: 'frames',
    frames: generatePulse(frameInner),
    size: 9,
  },

  // Static patterns
  { id: 'cross', name: 'cross', category: 'static', frames: [cross], size: 9 },
  {
    id: 'x-shape',
    name: 'x-shape',
    category: 'static',
    frames: [xShape],
    size: 9,
  },
  {
    id: 'diamond',
    name: 'diamond',
    category: 'static',
    frames: [diamond],
    size: 9,
  },
  {
    id: 'checkerboard',
    name: 'checkerboard',
    category: 'static',
    frames: [checkerboard],
    size: 9,
  },
  {
    id: 'rows-alt',
    name: 'rows-alt',
    category: 'static',
    frames: [rowsAlt],
    size: 9,
  },
  {
    id: 'stripes-h',
    name: 'stripes-h',
    category: 'static',
    frames: [stripesH],
    size: 9,
  },
  {
    id: 'stripes-v',
    name: 'stripes-v',
    category: 'static',
    frames: [stripesV],
    size: 9,
  },

  // Animated patterns...
  {
    id: 'wave-lr',
    name: 'wave-lr',
    category: 'wave',
    frames: generateWaveLR(),
    size: 9,
  },
  {
    id: 'wave-rl',
    name: 'wave-rl',
    category: 'wave',
    frames: generateWaveRL(),
    size: 9,
  },
  {
    id: 'wave-tb',
    name: 'wave-tb',
    category: 'wave',
    frames: generateWaveTB(),
    size: 9,
  },
  {
    id: 'wave-bt',
    name: 'wave-bt',
    category: 'wave',
    frames: generateWaveBT(),
    size: 9,
  },
  {
    id: 'diagonal-tl',
    name: 'diagonal-tl',
    category: 'diagonal',
    frames: generateDiagonalTL(),
    size: 9,
  },
  {
    id: 'diagonal-tr',
    name: 'diagonal-tr',
    category: 'diagonal',
    frames: generateDiagonalTR(),
    size: 9,
  },
  {
    id: 'diagonal-bl',
    name: 'diagonal-bl',
    category: 'diagonal',
    frames: generateDiagonalBL(),
    size: 9,
  },
  {
    id: 'diagonal-br',
    name: 'diagonal-br',
    category: 'diagonal',
    frames: generateDiagonalBR(),
    size: 9,
  },
  {
    id: 'ripple-out',
    name: 'ripple-out',
    category: 'ripple',
    frames: generateRippleOut(),
    size: 9,
  },
  {
    id: 'ripple-in',
    name: 'ripple-in',
    category: 'ripple',
    frames: generateRippleIn(),
    size: 9,
  },
  {
    id: 'spiral-cw',
    name: 'spiral-cw',
    category: 'spiral',
    frames: generateSpiralCW(),
    size: 9,
  },
  {
    id: 'spiral-ccw',
    name: 'spiral-ccw',
    category: 'spiral',
    frames: generateSpiralCCW(),
    size: 9,
  },
  {
    id: 'snake',
    name: 'snake',
    category: 'other',
    frames: generateSnake(),
    size: 9,
  },
  {
    id: 'rain',
    name: 'rain',
    category: 'other',
    frames: generateRain(),
    size: 9,
  },
]

export const presetCategories = [
  { id: 'all', name: 'All' },
  { id: 'points', name: 'Points' },
  { id: 'lines', name: 'Lines' },
  { id: 'shapes', name: 'Shapes' },
  { id: 'frames', name: 'Frames' },
  { id: 'static', name: 'Static' },
  { id: 'wave', name: 'Wave' },
  { id: 'diagonal', name: 'Diagonal' },
  { id: 'ripple', name: 'Ripple' },
  { id: 'spiral', name: 'Spiral' },
  { id: 'other', name: 'Other' },
]
