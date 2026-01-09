import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useEditorStore } from '../stores/editorStore'
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
  const store = useEditorStore()
  const [activeTab, setActiveTab] = useState<'presets' | 'timeline' | 'icons'>(
    'presets',
  )

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-mono">
      <div className="mx-auto max-w-[1600px] p-6 lg:p-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT: Toolbar */}
          <div className="col-span-12 lg:col-span-2">
            <div className="sticky top-24">
              <EditorToolbar store={store} />
            </div>
          </div>

          {/* CENTER: Canvas & Timeline */}
          <div className="col-span-12 lg:col-span-6">
            <div className="flex flex-col gap-6">
              {/* Canvas Area */}
              <div className="flex min-h-[500px] items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100/50 p-8 shadow-inner">
                <MatrixEditor store={store} size={28} gap={4} />
              </div>

              {/* Controls Section */}
              <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
                <div className="flex border-b border-zinc-200">
                  <button
                    onClick={() => setActiveTab('presets')}
                    className={`flex items-center gap-2 border-r border-zinc-200 px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'presets'
                        ? 'bg-white text-zinc-900'
                        : 'bg-zinc-50 text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    PRESETS
                  </button>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`flex items-center gap-2 border-r border-zinc-200 px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'timeline'
                        ? 'bg-white text-zinc-900'
                        : 'bg-zinc-50 text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    TIMELINE
                  </button>
                  <button
                    onClick={() => setActiveTab('icons')}
                    className={`flex items-center gap-2 border-r border-zinc-200 px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'icons'
                        ? 'bg-white text-zinc-900'
                        : 'bg-zinc-50 text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <Wand2 className="h-4 w-4" />
                    ICONS
                  </button>
                </div>

                <div className="p-4">
                  {activeTab === 'presets' ? (
                    <div className="h-[300px]">
                      <PresetPatterns store={store} />
                    </div>
                  ) : activeTab === 'timeline' ? (
                    <AnimationTimeline store={store} />
                  ) : (
                    <div className="h-[450px]">
                      <IconBrowser store={store} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Preview & Export */}
          <div className="col-span-12 lg:col-span-4">
            <div className="flex flex-col gap-6 sticky top-24">
              <IconPreview store={store} />
              <ExportPanel store={store} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
