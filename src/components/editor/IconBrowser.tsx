import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import {
  Heart,
  Star,
  Home,
  Settings,
  User,
  Bell,
  Mail,
  Search,
  Camera,
  Music,
  Play,
  Pause,
  Volume2,
  Mic,
  Phone,
  MessageSquare,
  Send,
  Download,
  Upload,
  Cloud,
  Sun,
  Moon,
  Zap,
  Battery,
  Wifi,
  Bluetooth,
  Lock,
  Unlock,
  Key,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RefreshCw,
  Trash2,
  Edit,
  Copy,
  Clipboard,
  Folder,
  File,
  FileText,
  Image,
  Film,
  Headphones,
  Speaker,
  Radio,
  Tv,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Cpu,
  HardDrive,
  Database,
  Server,
  Globe,
  MapPin,
  Navigation,
  Compass,
  Map,
  Clock,
  Calendar,
  AlarmClock,
  Timer,
  Hourglass,
  Gift,
  ShoppingCart,
  CreditCard,
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Activity,
  Target,
  Award,
  Trophy,
  Flag,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Link,
  Paperclip,
  Scissors,
  Maximize,
  Minimize,
  Move,
  Grid,
  List,
  Layout,
  Layers,
  Box,
  Package,
  Archive,
  Briefcase,
  Building,
  Store,
  Truck,
  Plane,
  Car,
  Bike,
  Train,
  Bus,
  Ship,
  Rocket,
  Anchor,
  Umbrella,
  Coffee,
  Pizza,
  Apple,
  Leaf,
  Flower,
  TreePine,
  Mountain,
  Waves,
  Droplet,
  Flame,
  Wind,
  Snowflake,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Rainbow,
  Sunrise,
  Sunset,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  CircleDot,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Diamond,
  Sparkles,
  Wand2,
  Palette,
  Brush,
  PenTool,
  Eraser,
  type LucideIcon,
} from 'lucide-react'
import type { EditorStore } from '../../stores/editorStore'
import { svgToMatrix } from '../../utils/svgToMatrix'
import { Matrix } from '../ui/Matrix'

interface IconBrowserProps {
  store: EditorStore
}

// Icon registry with categories
const ICON_REGISTRY: { name: string; icon: LucideIcon; category: string }[] = [
  // UI Essentials
  { name: 'Heart', icon: Heart, category: 'ui' },
  { name: 'Star', icon: Star, category: 'ui' },
  { name: 'Home', icon: Home, category: 'ui' },
  { name: 'Settings', icon: Settings, category: 'ui' },
  { name: 'User', icon: User, category: 'ui' },
  { name: 'Bell', icon: Bell, category: 'ui' },
  { name: 'Mail', icon: Mail, category: 'ui' },
  { name: 'Search', icon: Search, category: 'ui' },
  { name: 'Check', icon: Check, category: 'ui' },
  { name: 'X', icon: X, category: 'ui' },
  { name: 'Plus', icon: Plus, category: 'ui' },
  { name: 'Minus', icon: Minus, category: 'ui' },

  // Arrows & Navigation
  { name: 'ChevronUp', icon: ChevronUp, category: 'arrows' },
  { name: 'ChevronDown', icon: ChevronDown, category: 'arrows' },
  { name: 'ChevronLeft', icon: ChevronLeft, category: 'arrows' },
  { name: 'ChevronRight', icon: ChevronRight, category: 'arrows' },
  { name: 'ArrowUp', icon: ArrowUp, category: 'arrows' },
  { name: 'ArrowDown', icon: ArrowDown, category: 'arrows' },
  { name: 'ArrowLeft', icon: ArrowLeft, category: 'arrows' },
  { name: 'ArrowRight', icon: ArrowRight, category: 'arrows' },
  { name: 'RotateCw', icon: RotateCw, category: 'arrows' },
  { name: 'RefreshCw', icon: RefreshCw, category: 'arrows' },

  // Media
  { name: 'Camera', icon: Camera, category: 'media' },
  { name: 'Music', icon: Music, category: 'media' },
  { name: 'Play', icon: Play, category: 'media' },
  { name: 'Pause', icon: Pause, category: 'media' },
  { name: 'Volume2', icon: Volume2, category: 'media' },
  { name: 'Mic', icon: Mic, category: 'media' },
  { name: 'Headphones', icon: Headphones, category: 'media' },
  { name: 'Speaker', icon: Speaker, category: 'media' },
  { name: 'Radio', icon: Radio, category: 'media' },
  { name: 'Tv', icon: Tv, category: 'media' },
  { name: 'Film', icon: Film, category: 'media' },
  { name: 'Image', icon: Image, category: 'media' },

  // Communication
  { name: 'Phone', icon: Phone, category: 'communication' },
  { name: 'MessageSquare', icon: MessageSquare, category: 'communication' },
  { name: 'Send', icon: Send, category: 'communication' },
  { name: 'AtSign', icon: AtSign, category: 'communication' },

  // Files & Data
  { name: 'Download', icon: Download, category: 'files' },
  { name: 'Upload', icon: Upload, category: 'files' },
  { name: 'Cloud', icon: Cloud, category: 'files' },
  { name: 'Folder', icon: Folder, category: 'files' },
  { name: 'File', icon: File, category: 'files' },
  { name: 'FileText', icon: FileText, category: 'files' },
  { name: 'Clipboard', icon: Clipboard, category: 'files' },
  { name: 'Copy', icon: Copy, category: 'files' },
  { name: 'Trash2', icon: Trash2, category: 'files' },
  { name: 'Edit', icon: Edit, category: 'files' },
  { name: 'Archive', icon: Archive, category: 'files' },

  // Security
  { name: 'Lock', icon: Lock, category: 'security' },
  { name: 'Unlock', icon: Unlock, category: 'security' },
  { name: 'Key', icon: Key, category: 'security' },
  { name: 'Shield', icon: Shield, category: 'security' },
  { name: 'Eye', icon: Eye, category: 'security' },
  { name: 'EyeOff', icon: EyeOff, category: 'security' },

  // Devices
  { name: 'Monitor', icon: Monitor, category: 'devices' },
  { name: 'Smartphone', icon: Smartphone, category: 'devices' },
  { name: 'Tablet', icon: Tablet, category: 'devices' },
  { name: 'Watch', icon: Watch, category: 'devices' },
  { name: 'Cpu', icon: Cpu, category: 'devices' },
  { name: 'HardDrive', icon: HardDrive, category: 'devices' },
  { name: 'Database', icon: Database, category: 'devices' },
  { name: 'Server', icon: Server, category: 'devices' },
  { name: 'Wifi', icon: Wifi, category: 'devices' },
  { name: 'Bluetooth', icon: Bluetooth, category: 'devices' },
  { name: 'Battery', icon: Battery, category: 'devices' },

  // Weather & Nature
  { name: 'Sun', icon: Sun, category: 'weather' },
  { name: 'Moon', icon: Moon, category: 'weather' },
  { name: 'Cloud', icon: Cloud, category: 'weather' },
  { name: 'CloudRain', icon: CloudRain, category: 'weather' },
  { name: 'CloudSnow', icon: CloudSnow, category: 'weather' },
  { name: 'CloudLightning', icon: CloudLightning, category: 'weather' },
  { name: 'Snowflake', icon: Snowflake, category: 'weather' },
  { name: 'Droplet', icon: Droplet, category: 'weather' },
  { name: 'Wind', icon: Wind, category: 'weather' },
  { name: 'Umbrella', icon: Umbrella, category: 'weather' },
  { name: 'Rainbow', icon: Rainbow, category: 'weather' },
  { name: 'Sunrise', icon: Sunrise, category: 'weather' },
  { name: 'Sunset', icon: Sunset, category: 'weather' },
  { name: 'Flame', icon: Flame, category: 'weather' },
  { name: 'Waves', icon: Waves, category: 'weather' },
  { name: 'Mountain', icon: Mountain, category: 'weather' },
  { name: 'TreePine', icon: TreePine, category: 'weather' },
  { name: 'Leaf', icon: Leaf, category: 'weather' },
  { name: 'Flower', icon: Flower, category: 'weather' },

  // Commerce
  { name: 'ShoppingCart', icon: ShoppingCart, category: 'commerce' },
  { name: 'CreditCard', icon: CreditCard, category: 'commerce' },
  { name: 'Wallet', icon: Wallet, category: 'commerce' },
  { name: 'DollarSign', icon: DollarSign, category: 'commerce' },
  { name: 'Gift', icon: Gift, category: 'commerce' },
  { name: 'Tag', icon: Tag, category: 'commerce' },
  { name: 'Store', icon: Store, category: 'commerce' },
  { name: 'Package', icon: Package, category: 'commerce' },

  // Charts & Data
  { name: 'TrendingUp', icon: TrendingUp, category: 'charts' },
  { name: 'TrendingDown', icon: TrendingDown, category: 'charts' },
  { name: 'BarChart', icon: BarChart, category: 'charts' },
  { name: 'PieChart', icon: PieChart, category: 'charts' },
  { name: 'Activity', icon: Activity, category: 'charts' },
  { name: 'Target', icon: Target, category: 'charts' },

  // Time
  { name: 'Clock', icon: Clock, category: 'time' },
  { name: 'Calendar', icon: Calendar, category: 'time' },
  { name: 'AlarmClock', icon: AlarmClock, category: 'time' },
  { name: 'Timer', icon: Timer, category: 'time' },
  { name: 'Hourglass', icon: Hourglass, category: 'time' },

  // Location
  { name: 'Globe', icon: Globe, category: 'location' },
  { name: 'MapPin', icon: MapPin, category: 'location' },
  { name: 'Navigation', icon: Navigation, category: 'location' },
  { name: 'Compass', icon: Compass, category: 'location' },
  { name: 'Map', icon: Map, category: 'location' },

  // Transport
  { name: 'Car', icon: Car, category: 'transport' },
  { name: 'Bike', icon: Bike, category: 'transport' },
  { name: 'Train', icon: Train, category: 'transport' },
  { name: 'Bus', icon: Bus, category: 'transport' },
  { name: 'Plane', icon: Plane, category: 'transport' },
  { name: 'Ship', icon: Ship, category: 'transport' },
  { name: 'Truck', icon: Truck, category: 'transport' },
  { name: 'Rocket', icon: Rocket, category: 'transport' },
  { name: 'Anchor', icon: Anchor, category: 'transport' },

  // Fun & Social
  { name: 'ThumbsUp', icon: ThumbsUp, category: 'social' },
  { name: 'ThumbsDown', icon: ThumbsDown, category: 'social' },
  { name: 'Smile', icon: Smile, category: 'social' },
  { name: 'Frown', icon: Frown, category: 'social' },
  { name: 'Meh', icon: Meh, category: 'social' },
  { name: 'Laugh', icon: Laugh, category: 'social' },
  { name: 'Angry', icon: Angry, category: 'social' },
  { name: 'Award', icon: Award, category: 'social' },
  { name: 'Trophy', icon: Trophy, category: 'social' },

  // Alerts
  { name: 'AlertCircle', icon: AlertCircle, category: 'alerts' },
  { name: 'AlertTriangle', icon: AlertTriangle, category: 'alerts' },
  { name: 'Info', icon: Info, category: 'alerts' },
  { name: 'HelpCircle', icon: HelpCircle, category: 'alerts' },

  // Shapes
  { name: 'Circle', icon: Circle, category: 'shapes' },
  { name: 'CircleDot', icon: CircleDot, category: 'shapes' },
  { name: 'Square', icon: Square, category: 'shapes' },
  { name: 'Triangle', icon: Triangle, category: 'shapes' },
  { name: 'Diamond', icon: Diamond, category: 'shapes' },
  { name: 'Hexagon', icon: Hexagon, category: 'shapes' },
  { name: 'Octagon', icon: Octagon, category: 'shapes' },
  { name: 'Pentagon', icon: Pentagon, category: 'shapes' },

  // Creative
  { name: 'Zap', icon: Zap, category: 'creative' },
  { name: 'Sparkles', icon: Sparkles, category: 'creative' },
  { name: 'Wand2', icon: Wand2, category: 'creative' },
  { name: 'Palette', icon: Palette, category: 'creative' },
  { name: 'Brush', icon: Brush, category: 'creative' },
  { name: 'PenTool', icon: PenTool, category: 'creative' },
  { name: 'Eraser', icon: Eraser, category: 'creative' },

  // Layout
  { name: 'Grid', icon: Grid, category: 'layout' },
  { name: 'List', icon: List, category: 'layout' },
  { name: 'Layout', icon: Layout, category: 'layout' },
  { name: 'Layers', icon: Layers, category: 'layout' },
  { name: 'Box', icon: Box, category: 'layout' },
  { name: 'Maximize', icon: Maximize, category: 'layout' },
  { name: 'Minimize', icon: Minimize, category: 'layout' },
  { name: 'Move', icon: Move, category: 'layout' },

  // Misc
  { name: 'Coffee', icon: Coffee, category: 'misc' },
  { name: 'Pizza', icon: Pizza, category: 'misc' },
  { name: 'Apple', icon: Apple, category: 'misc' },
  { name: 'Briefcase', icon: Briefcase, category: 'misc' },
  { name: 'Building', icon: Building, category: 'misc' },
  { name: 'Flag', icon: Flag, category: 'misc' },
  { name: 'Bookmark', icon: Bookmark, category: 'misc' },
  { name: 'Link', icon: Link, category: 'misc' },
  { name: 'Paperclip', icon: Paperclip, category: 'misc' },
  { name: 'Scissors', icon: Scissors, category: 'misc' },
  { name: 'Hash', icon: Hash, category: 'misc' },
]

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'ui', name: 'UI' },
  { id: 'arrows', name: 'Arrows' },
  { id: 'media', name: 'Media' },
  { id: 'communication', name: 'Chat' },
  { id: 'files', name: 'Files' },
  { id: 'security', name: 'Security' },
  { id: 'devices', name: 'Devices' },
  { id: 'weather', name: 'Nature' },
  { id: 'commerce', name: 'Commerce' },
  { id: 'charts', name: 'Charts' },
  { id: 'time', name: 'Time' },
  { id: 'location', name: 'Location' },
  { id: 'transport', name: 'Transport' },
  { id: 'social', name: 'Social' },
  { id: 'shapes', name: 'Shapes' },
  { id: 'creative', name: 'Creative' },
]

const GRID_SIZES = [
  { value: 7, label: '7×7' },
  { value: 9, label: '9×9' },
  { value: 12, label: '12×12' },
  { value: 16, label: '16×16' },
]

export function IconBrowser({ store }: IconBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIcon, setSelectedIcon] = useState<
    (typeof ICON_REGISTRY)[0] | null
  >(null)
  const [threshold, setThreshold] = useState(0.15)
  const [gridSize, setGridSize] = useState(9)
  const [previewFrame, setPreviewFrame] = useState<number[][] | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const iconRef = useRef<SVGSVGElement | null>(null)

  // Filter icons
  const filteredIcons = useMemo(() => {
    return ICON_REGISTRY.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Convert selected icon to matrix preview
  const convertToMatrix = useCallback(async () => {
    if (!selectedIcon || !iconRef.current) return

    setIsConverting(true)
    try {
      // Get SVG string from the rendered icon
      const svgElement = iconRef.current
      const clone = svgElement.cloneNode(true) as SVGSVGElement

      // Set proper dimensions and viewBox for Lucide icons (24x24 native)
      clone.setAttribute('width', '256')
      clone.setAttribute('height', '256')
      clone.setAttribute('viewBox', '0 0 24 24')

      // Calculate stroke width - thicker strokes for smaller grids
      // At 9x9, we need ~2.5px stroke to be visible
      // At 16x16, we can use standard 2px stroke
      const scaledStrokeWidth = Math.max(1.5, 2.5 * (9 / gridSize))

      // Apply stroke styles to SVG root and all child elements
      clone.style.fill = 'none'
      clone.style.stroke = 'black'
      clone.style.strokeWidth = String(scaledStrokeWidth)
      clone.style.strokeLinecap = 'round'
      clone.style.strokeLinejoin = 'round'

      // Also apply to all path/shape elements
      clone
        .querySelectorAll('path, line, circle, rect, polyline, polygon')
        .forEach((el) => {
          const svgEl = el as SVGElement
          svgEl.setAttribute('stroke', 'black')
          svgEl.setAttribute('stroke-width', String(scaledStrokeWidth))
          svgEl.setAttribute('stroke-linecap', 'round')
          svgEl.setAttribute('stroke-linejoin', 'round')
          svgEl.setAttribute('fill', 'none')
        })

      const svgString = new XMLSerializer().serializeToString(clone)

      const frame = await svgToMatrix(svgString, gridSize, gridSize, {
        threshold,
        smooth: true,
        invert: false,
      })

      setPreviewFrame(frame)
    } catch (error) {
      console.error('Failed to convert icon:', error)
    } finally {
      setIsConverting(false)
    }
  }, [selectedIcon, threshold, gridSize])

  // Update preview when icon, threshold, or size changes
  useEffect(() => {
    if (selectedIcon) {
      convertToMatrix()
    }
  }, [selectedIcon, threshold, gridSize, convertToMatrix])

  // Apply to canvas
  const handleApply = useCallback(() => {
    if (!previewFrame) return
    store.loadPattern(previewFrame)
  }, [previewFrame, store])

  return (
    <div className="flex h-full gap-4">
      {/* Left: Icon Grid */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-zinc-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-2 py-1 text-[10px] font-medium uppercase tracking-wide transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-6 gap-1">
            {filteredIcons.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => setSelectedIcon(item)}
                  className={`aspect-square flex items-center justify-center border transition-all hover:bg-zinc-50 ${
                    selectedIcon?.name === item.name
                      ? 'border-zinc-900 bg-zinc-100'
                      : 'border-zinc-100'
                  }`}
                  title={item.name}
                >
                  <IconComponent className="h-5 w-5 text-zinc-700" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right: Preview & Controls */}
      <div className="w-48 flex flex-col gap-4 border-l border-zinc-200 pl-4 overflow-y-auto">
        {selectedIcon ? (
          <>
            {/* Selected Icon Display */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border border-zinc-200 bg-white mb-2">
                <selectedIcon.icon
                  ref={iconRef}
                  className="w-10 h-10 text-zinc-900"
                />
              </div>
              <p className="text-xs font-medium text-zinc-900">
                {selectedIcon.name}
              </p>
            </div>

            {/* Grid Size */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Grid Size
              </label>
              <div className="grid grid-cols-2 gap-1">
                {GRID_SIZES.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setGridSize(size.value)}
                    className={`px-2 py-1 text-xs font-medium border transition-all ${
                      gridSize === size.value
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Threshold Slider */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Threshold: {Math.round(threshold * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
              />
            </div>

            {/* Matrix Preview */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Preview
              </label>
              <div className="flex justify-center p-2 border border-zinc-200 bg-zinc-50">
                {previewFrame && !isConverting ? (
                  <Matrix
                    rows={gridSize}
                    cols={gridSize}
                    pattern={previewFrame}
                    size={Math.floor(120 / gridSize)}
                    gap={1}
                    palette={{
                      on: store.state.palette.on,
                      off: store.state.palette.off,
                    }}
                    glow={false}
                  />
                ) : (
                  <div className="w-[120px] h-[120px] flex items-center justify-center text-zinc-400 text-xs">
                    {isConverting ? 'Converting...' : 'Select an icon'}
                  </div>
                )}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApply}
              disabled={!previewFrame || isConverting}
              className="w-full bg-zinc-900 text-white py-2 text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              APPLY TO CANVAS
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs text-center px-4">
            Select an icon from the grid to preview and convert
          </div>
        )}
      </div>
    </div>
  )
}
