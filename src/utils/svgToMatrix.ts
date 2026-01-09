import type { Frame } from '../components/ui/Matrix'

export interface SvgToMatrixOptions {
  /** Brightness threshold (0-1). Pixels below this become 0, above become proportional. Default: 0.1 */
  threshold?: number
  /** Whether to invert the output (dark becomes light). Default: false */
  invert?: boolean
  /** Use smooth gradients vs binary output. Default: true */
  smooth?: boolean
  /** Stroke width for the icon. Default: 2 */
  strokeWidth?: number
}

// Render at this multiple of target size for better quality
const SUPERSAMPLE_FACTOR = 8

/**
 * Converts an SVG string to a Frame (2D array of brightness values 0-1)
 * Uses supersampling for better quality at low resolutions
 */
export async function svgToMatrix(
  svgString: string,
  rows: number,
  cols: number,
  options: SvgToMatrixOptions = {},
): Promise<Frame> {
  const { threshold = 0.1, invert = false, smooth = true } = options

  // Render at higher resolution for better quality
  const renderWidth = cols * SUPERSAMPLE_FACTOR
  const renderHeight = rows * SUPERSAMPLE_FACTOR

  // Create an off-screen canvas at high resolution
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  canvas.width = renderWidth
  canvas.height = renderHeight

  // Create an image from SVG
  const img = new Image()
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Failed to load SVG'))
    img.src = url
  })

  // Fill with white background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, renderWidth, renderHeight)

  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Draw SVG to canvas at high resolution
  ctx.drawImage(img, 0, 0, renderWidth, renderHeight)

  URL.revokeObjectURL(url)

  // Sample pixel data
  const imageData = ctx.getImageData(0, 0, renderWidth, renderHeight)
  const pixels = imageData.data

  // Convert to Frame by averaging each cell's pixels
  const frame: Frame = []

  for (let row = 0; row < rows; row++) {
    frame[row] = []
    for (let col = 0; col < cols; col++) {
      // Calculate the region in the high-res image for this cell
      const startX = col * SUPERSAMPLE_FACTOR
      const startY = row * SUPERSAMPLE_FACTOR

      // Average all pixels in this cell
      let totalBrightness = 0

      for (let dy = 0; dy < SUPERSAMPLE_FACTOR; dy++) {
        for (let dx = 0; dx < SUPERSAMPLE_FACTOR; dx++) {
          const px = startX + dx
          const py = startY + dy
          const i = (py * renderWidth + px) * 4

          const r = pixels[i]
          const g = pixels[i + 1]
          const b = pixels[i + 2]

          // Calculate grayscale luminance (0-255)
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b

          // Convert to 0-1 scale (inverted: darker = brighter in matrix)
          totalBrightness += 1 - luminance / 255
        }
      }

      // Average brightness for this cell
      let brightness =
        totalBrightness / (SUPERSAMPLE_FACTOR * SUPERSAMPLE_FACTOR)

      if (invert) {
        brightness = 1 - brightness
      }

      // Apply threshold
      if (brightness < threshold) {
        brightness = 0
      } else if (!smooth) {
        brightness = brightness > 0.5 ? 1 : 0
      }

      frame[row][col] = Math.round(brightness * 100) / 100
    }
  }

  return frame
}

/**
 * Creates an SVG string from a Lucide icon element for conversion
 * Properly handles stroke-based icons with appropriate scaling
 */
export function createSvgFromIcon(
  iconElement: SVGSVGElement,
  targetSize: number,
  strokeWidth: number = 2,
): string {
  // Clone the element to avoid modifying the original
  const clone = iconElement.cloneNode(true) as SVGSVGElement

  // Lucide icons use a 24x24 viewBox - we need to scale stroke appropriately
  clone.setAttribute('width', String(targetSize * SUPERSAMPLE_FACTOR))
  clone.setAttribute('height', String(targetSize * SUPERSAMPLE_FACTOR))
  clone.setAttribute('viewBox', '0 0 24 24')

  // Scale stroke width to be visible at the target resolution
  // At low res (9x9), we need thicker strokes to be visible
  const scaledStrokeWidth = strokeWidth * (24 / targetSize) * 0.8

  // Apply styles to all path elements
  clone
    .querySelectorAll('path, line, circle, rect, polyline, polygon')
    .forEach((el) => {
      ;(el as SVGElement).style.fill = 'none'
      ;(el as SVGElement).style.stroke = 'black'
      ;(el as SVGElement).style.strokeWidth = String(scaledStrokeWidth)
      ;(el as SVGElement).style.strokeLinecap = 'round'
      ;(el as SVGElement).style.strokeLinejoin = 'round'
    })

  // Also set on the root element
  clone.style.fill = 'none'
  clone.style.stroke = 'black'
  clone.style.strokeWidth = String(scaledStrokeWidth)

  return new XMLSerializer().serializeToString(clone)
}

/**
 * Generate preview of how an icon will look in the matrix
 */
export async function previewIconAsMatrix(
  svgString: string,
  size: number,
  options?: SvgToMatrixOptions,
): Promise<Frame> {
  return svgToMatrix(svgString, size, size, options)
}
