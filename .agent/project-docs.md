# Matrix Icon Maker - Project Documentation

> Professional-grade LED matrix editor for designing, animating, and exporting pixel-perfect icons.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + SPA mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [TanStack Router](https://tanstack.com/router) (file-based)
- **Build**: [Vite 7](https://vitejs.dev/)
- **Compiler**: [React Compiler](https://react.dev/learn/react-compiler)
- **Package Manager**: Bun

## Project Structure

```
matrix-icon-maker/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── Matrix.tsx          # Core matrix display component
│   │   ├── editor/
│   │   │   ├── MatrixEditor.tsx    # Interactive pixel editor
│   │   │   ├── EditorToolbar.tsx   # Tools, palette, settings
│   │   │   ├── AnimationTimeline.tsx # Frame sequencer
│   │   │   ├── IconBrowser.tsx     # Lucide icon converter
│   │   │   ├── IconPreview.tsx     # Live preview panel
│   │   │   ├── PresetPatterns.tsx  # Preset pattern browser
│   │   │   └── ExportPanel.tsx     # Export controls
│   │   └── Header.tsx              # Navigation header
│   ├── data/
│   │   └── presets.ts              # Pattern generators & presets
│   ├── stores/
│   │   └── editorStore.ts          # Editor state (React hooks)
│   ├── routes/
│   │   ├── __root.tsx              # Root layout
│   │   ├── index.tsx               # Landing page
│   │   ├── editor.tsx              # Editor page
│   │   └── patterns.tsx            # Patterns gallery
│   ├── utils/
│   │   └── svgToMatrix.ts          # SVG to matrix converter
│   └── router.tsx                  # Router configuration
├── vite.config.ts                  # Vite + TanStack Start config
└── package.json
```

---

## Core Components

### Matrix Component

**File**: `src/components/ui/Matrix.tsx`

The core display component that renders LED matrix visualizations with glow effects.

#### Props

| Prop              | Type                           | Default          | Description                      |
| ----------------- | ------------------------------ | ---------------- | -------------------------------- |
| `rows`            | `number`                       | required         | Number of rows                   |
| `cols`            | `number`                       | required         | Number of columns                |
| `pattern`         | `Frame`                        | -                | Static frame to display          |
| `frames`          | `Frame[]`                      | -                | Animation frames                 |
| `fps`             | `number`                       | `12`             | Animation speed                  |
| `autoplay`        | `boolean`                      | `true`           | Start animation automatically    |
| `loop`            | `boolean`                      | `true`           | Loop animation                   |
| `paused`          | `boolean`                      | `false`          | Pause animation externally       |
| `size`            | `number`                       | `10`             | Pixel size in px                 |
| `gap`             | `number`                       | `2`              | Gap between pixels               |
| `palette.on`      | `string`                       | `'currentColor'` | Active pixel color               |
| `palette.off`     | `string`                       | `'#374151'`      | Inactive pixel color             |
| `brightness`      | `number`                       | `1`              | Global brightness (0-1)          |
| `glow`            | `boolean`                      | `true`           | Enable glow effects              |
| `bloomIntensity`  | `number`                       | `30`             | Bloom strength (0-100)           |
| `fadeIntensity`   | `number`                       | `50`             | Fade intensity (0-100)           |
| `transitionSpeed` | `'slow' \| 'normal' \| 'fast'` | `'normal'`       | Animation transition speed       |
| `mode`            | `'default' \| 'vu'`            | `'default'`      | Display mode                     |
| `levels`          | `number[]`                     | -                | VU meter levels (0-1 per column) |

#### Types

```typescript
type Frame = number[][] // 2D array of brightness values (0-1)
```

---

### EditorStore Hook

**File**: `src/stores/editorStore.ts`

React hooks-based state management for the editor.

#### State

| Property            | Type                                      | Description              |
| ------------------- | ----------------------------------------- | ------------------------ |
| `frames`            | `Frame[]`                                 | All animation frames     |
| `currentFrameIndex` | `number`                                  | Active frame index       |
| `gridSize`          | `{ rows, cols }`                          | Matrix dimensions        |
| `palette`           | `{ on, off }`                             | Color palette            |
| `tool`              | `'brush' \| 'eraser' \| 'fill' \| 'line'` | Active tool              |
| `brushBrightness`   | `number`                                  | Brush intensity (0-1)    |
| `fps`               | `number`                                  | Animation FPS            |
| `isPlaying`         | `boolean`                                 | Animation playback state |
| `glow`              | `boolean`                                 | Glow effect enabled      |
| `gridVisibility`    | `'hidden' \| 'normal' \| 'prominent'`     | Grid display mode        |
| `history`           | `Frame[][]`                               | Undo history (max 50)    |
| `historyIndex`      | `number`                                  | Current history position |

#### Actions

- `setPixel(row, col, value)` - Set single pixel
- `clearFrame()` - Clear current frame
- `fillFrame(value)` - Fill entire frame
- `addFrame()` / `duplicateFrame()` / `deleteFrame()` - Frame management
- `setGridSize(rows, cols)` - Resize matrix
- `loadPattern(frame)` - Load static pattern
- `loadFrames(frames)` - Load animation
- `undo()` / `redo()` - History navigation
- `togglePlaying()` / `toggleGlow()` - Toggle states

---

### Preset Pattern Generators

**File**: `src/data/presets.ts`

Functions for generating animated patterns:

| Function                          | Description         |
| --------------------------------- | ------------------- |
| `generateWaveLR/RL/TB/BT()`       | Wave animations     |
| `generateDiagonalTL/TR/BL/BR()`   | Diagonal sweeps     |
| `generateRippleOut/In()`          | Circular ripples    |
| `generateSpiralCW/CCW()`          | Spiral patterns     |
| `generateSnake/SnakeRev()`        | Snake trail         |
| `generateRain/RainRev()`          | Rain drops          |
| `generatePulse(pattern)`          | Pulsing animation   |
| `generateShift(frame, direction)` | Translate animation |
| `generateRotate(frame)`           | Rotation animation  |
| `generateMarchingBorder()`        | Marching ants       |
| `generateBlink(frame)`            | Blink animation     |

---

## Routes

| Route       | Component      | Description            |
| ----------- | -------------- | ---------------------- |
| `/`         | `LandingPage`  | Marketing landing page |
| `/editor`   | `EditorPage`   | Main matrix editor     |
| `/patterns` | `PatternsPage` | Pattern gallery        |

---

## Development

### Run Development Server

```bash
npm run dev
```

Server starts at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

SPA mode outputs to `dist/` with `_shell.html` for client-side routing.

### Run Tests

```bash
npm run test
```

### Lint & Format

```bash
npm run check
```

---

## Configuration

### SPA Mode

Configured in `vite.config.ts`:

```typescript
tanstackStart({
  spa: {
    enabled: true,
  },
})
```

### Performance Optimizations

1. **Hover-based animations** - Presets animate only on hover
2. **Paused prop** - External control of animation loops
3. **React Compiler** - Automatic memoization
4. **Bloom intensity controls** - Reduced filter overhead

---

## Changelog

### v1.1.0 (2026-01-10)

- ✅ Enabled SPA mode (TanStack Start)
- ✅ Added `paused` prop to Matrix component
- ✅ Fixed memory leaks in PresetPatterns (hover-based animations)
- ✅ Added `bloomIntensity`, `fadeIntensity`, `transitionSpeed` props
- ✅ Removed Cloudflare SSR plugin

### v1.0.0 (Initial)

- Matrix editor with brush, eraser, fill tools
- Animation timeline with frame management
- 40+ preset patterns
- Lucide icon converter
- SVG/PNG export
