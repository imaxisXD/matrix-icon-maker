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
// PRESET COLLECTION
// ============================================================================

export interface PresetPattern {
  id: string
  name: string
  category: 'static' | 'wave' | 'diagonal' | 'ripple' | 'spiral' | 'other'
  frames: Frame[]
  size: number
}

export const presets: PresetPattern[] = [
  // Static patterns
  { id: 'cross', name: 'Cross', category: 'static', frames: [cross], size: 9 },
  {
    id: 'x-shape',
    name: 'X Shape',
    category: 'static',
    frames: [xShape],
    size: 9,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'static',
    frames: [diamond],
    size: 9,
  },
  {
    id: 'corners',
    name: 'Corners',
    category: 'static',
    frames: [corners],
    size: 9,
  },
  {
    id: 'checkerboard',
    name: 'Checkerboard',
    category: 'static',
    frames: [checkerboard],
    size: 9,
  },
  {
    id: 'rows-alt',
    name: 'Rows Alt',
    category: 'static',
    frames: [rowsAlt],
    size: 9,
  },
  {
    id: 'stripes-h',
    name: 'Stripes H',
    category: 'static',
    frames: [stripesH],
    size: 9,
  },
  {
    id: 'stripes-v',
    name: 'Stripes V',
    category: 'static',
    frames: [stripesV],
    size: 9,
  },

  // Wave animations
  {
    id: 'wave-lr',
    name: 'Wave LR',
    category: 'wave',
    frames: generateWaveLR(),
    size: 9,
  },
  {
    id: 'wave-rl',
    name: 'Wave RL',
    category: 'wave',
    frames: generateWaveRL(),
    size: 9,
  },
  {
    id: 'wave-tb',
    name: 'Wave TB',
    category: 'wave',
    frames: generateWaveTB(),
    size: 9,
  },
  {
    id: 'wave-bt',
    name: 'Wave BT',
    category: 'wave',
    frames: generateWaveBT(),
    size: 9,
  },

  // Diagonal animations
  {
    id: 'diagonal-tl',
    name: 'Diagonal TL',
    category: 'diagonal',
    frames: generateDiagonalTL(),
    size: 9,
  },
  {
    id: 'diagonal-tr',
    name: 'Diagonal TR',
    category: 'diagonal',
    frames: generateDiagonalTR(),
    size: 9,
  },
  {
    id: 'diagonal-bl',
    name: 'Diagonal BL',
    category: 'diagonal',
    frames: generateDiagonalBL(),
    size: 9,
  },
  {
    id: 'diagonal-br',
    name: 'Diagonal BR',
    category: 'diagonal',
    frames: generateDiagonalBR(),
    size: 9,
  },

  // Ripple animations
  {
    id: 'ripple-out',
    name: 'Ripple Out',
    category: 'ripple',
    frames: generateRippleOut(),
    size: 9,
  },
  {
    id: 'ripple-in',
    name: 'Ripple In',
    category: 'ripple',
    frames: generateRippleIn(),
    size: 9,
  },

  // Spiral animations
  {
    id: 'spiral-cw',
    name: 'Spiral CW',
    category: 'spiral',
    frames: generateSpiralCW(),
    size: 9,
  },
  {
    id: 'spiral-ccw',
    name: 'Spiral CCW',
    category: 'spiral',
    frames: generateSpiralCCW(),
    size: 9,
  },

  // Other animations
  {
    id: 'snake',
    name: 'Snake',
    category: 'other',
    frames: generateSnake(),
    size: 9,
  },
  {
    id: 'snake-rev',
    name: 'Snake Rev',
    category: 'other',
    frames: generateSnakeRev(),
    size: 9,
  },
  {
    id: 'rain',
    name: 'Rain',
    category: 'other',
    frames: generateRain(),
    size: 9,
  },
  {
    id: 'rain-rev',
    name: 'Rain Rev',
    category: 'other',
    frames: generateRainRev(),
    size: 9,
  },

  // Pulsing static patterns
  {
    id: 'cross-pulse',
    name: 'Cross Pulse',
    category: 'static',
    frames: generatePulse(cross),
    size: 9,
  },
  {
    id: 'x-pulse',
    name: 'X Pulse',
    category: 'static',
    frames: generatePulse(xShape),
    size: 9,
  },
  {
    id: 'diamond-pulse',
    name: 'Diamond Pulse',
    category: 'static',
    frames: generatePulse(diamond),
    size: 9,
  },
]

export const presetCategories = [
  { id: 'all', name: 'All' },
  { id: 'static', name: 'Static' },
  { id: 'wave', name: 'Wave' },
  { id: 'diagonal', name: 'Diagonal' },
  { id: 'ripple', name: 'Ripple' },
  { id: 'spiral', name: 'Spiral' },
  { id: 'other', name: 'Other' },
]
