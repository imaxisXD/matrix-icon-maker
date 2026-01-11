import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MatrixEditor } from '../components/editor/MatrixEditor'
import { EditorToolbar } from '../components/editor/EditorToolbar'
import { AnimationTimeline } from '../components/editor/AnimationTimeline'
import { IconPreview } from '../components/editor/IconPreview'
import { ExportPanel } from '../components/editor/ExportPanel'
import { PresetPatterns } from '../components/editor/PresetPatterns'
import { IconBrowser } from '../components/editor/IconBrowser'
import { LayoutGrid, Layers, Wand2 } from 'lucide-react'

export const Route = createFileRoute('/editor')({ component: EditorPage })

function EditorPage() {
  const [activeTab, setActiveTab] = useState<'presets' | 'timeline' | 'icons'>(
    'presets',
  )

  return (
    <div className="min-h-screen font-mono">
      {/* Main Grid Layout */}
      <div className="mx-auto max-w-[1800px] p-6">
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT: Toolbar */}
          <div className="col-span-12 lg:col-span-2">
            <div className="sticky top-6">
              <EditorToolbar />
            </div>
          </div>

          {/* CENTER: Canvas & Timeline */}
          <div className="col-span-12 lg:col-span-6">
            <div className="flex flex-col gap-6">
              {/* Canvas Area */}
              <div className="relative overflow-hidden rounded-lg border border-[#e0ddd5] bg-white shadow-sm">
                {/* Corner Accents */}
                <div className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full border border-[#0066cc]/20" />
                <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full border border-[#0066cc]/20" />
                <div className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full border border-[#0066cc]/20" />
                <div className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full border border-[#0066cc]/20" />

                <div className="flex min-h-[520px] items-center justify-center p-4">
                  <MatrixEditor size={28} gap={4} />
                </div>
              </div>

              {/* Controls Section */}
              <div className="rounded-lg border border-[#e0ddd5] bg-white shadow-sm overflow-hidden">
                <div className="flex border-b border-[#e0ddd5] bg-[#f8f7f4]/50">
                  <button
                    onClick={() => setActiveTab('presets')}
                    className={`relative flex items-center gap-2 border-r border-[#e0ddd5] px-5 py-3 text-xs font-bold tracking-wider transition-all ${
                      activeTab === 'presets'
                        ? 'text-[#0066cc] bg-white'
                        : 'text-[#8a8a8a] hover:text-[#6a6a6a]'
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    PRESETS
                    {activeTab === 'presets' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066cc]" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`relative flex items-center gap-2 border-r border-[#e0ddd5] px-5 py-3 text-xs font-bold tracking-wider transition-all ${
                      activeTab === 'timeline'
                        ? 'text-[#0066cc] bg-white'
                        : 'text-[#8a8a8a] hover:text-[#6a6a6a]'
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    TIMELINE
                    {activeTab === 'timeline' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066cc]" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('icons')}
                    className={`relative flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-wider transition-all ${
                      activeTab === 'icons'
                        ? 'text-[#0066cc] bg-white'
                        : 'text-[#8a8a8a] hover:text-[#6a6a6a]'
                    }`}
                  >
                    <Wand2 className="h-4 w-4" />
                    ICON LIBRARY
                    {activeTab === 'icons' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066cc]" />
                    )}
                  </button>
                </div>

                <div className="p-5">
                  {activeTab === 'presets' ? (
                    <div className="h-[280px]">
                      <PresetPatterns />
                    </div>
                  ) : activeTab === 'timeline' ? (
                    <AnimationTimeline />
                  ) : (
                    <div className="h-[420px]">
                      <IconBrowser />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Preview & Export */}
          <div className="col-span-12 lg:col-span-4">
            <div className="flex flex-col gap-6 sticky top-6">
              <IconPreview />
              <ExportPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
