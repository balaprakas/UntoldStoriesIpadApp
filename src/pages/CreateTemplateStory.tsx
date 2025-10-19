import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CoverPage } from '@/components/TemplateCoverPage'
import { InstructionsPage } from '@/components/InstructionsPage'
import { StoryBuilderPage } from '@/components/TemplateBuilderPage'
import { StoryPage } from '@/components/TemplateStoryPage'
import { templateService } from '@/lib/templateService'
import { supabase } from '@/lib/supabase'
import { localDB } from '@/lib/localDB'
import { ArrowLeft, Save } from 'lucide-react'

interface TemplateStoryData {
  coverData: {
    title: string
    author: string
  }
  builderResponses: string[]
  storyPages: Array<{ image?: string; text?: string }>
}

export default function CreateTemplateStory() {
  const { templateId } = useParams<{ templateId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [currentPage, setCurrentPage] = useState(0)
  const [storyId] = useState(() => crypto.randomUUID())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [coverData, setCoverData] = useState({ title: '', author: '' })
  const [builderResponses, setBuilderResponses] = useState<string[]>(['', '', ''])
  const [storyPagesData, setStoryPagesData] = useState<Array<{ image?: string; text?: string }>>([
    {}, {}, {}, {}, {}, {}, {}
  ])

  const storyPrompts = [
    "Hey there… who's that with the bouncy curls and sparkly eyes?",
    "Psst… did you spot that shy little whiskered fellow peeking from behind the reeds?",
    "Uh-oh… what's this? A trickle where a rushing creek once flowed?",
    "Wait—did those glowing pebbles just… dim?",
    "A secret map? A whispered legend? Or just a really good guess?",
    "Shh… hear that hum in the air? Something magical might be close!",
    "Oops! A sudden splash—did Finn just set something off?"
  ]

  useEffect(() => {
    loadOrCreateStory()
  }, [templateId, user])

  const loadOrCreateStory = async () => {
    if (!user) return

    try {
      const localStory = await localDB.getStory(storyId)
      
      if (localStory && localStory.bookData) {
        const data = localStory.bookData as TemplateStoryData
        setCoverData(data.coverData || { title: '', author: '' })
        setBuilderResponses(data.builderResponses || ['', '', ''])
        setStoryPagesData(data.storyPages || [{}, {}, {}, {}, {}, {}, {}])
      } else if (templateId) {
        const template = await templateService.getTemplate(templateId)
        if (template) {
          const initialData: TemplateStoryData = {
            coverData: { title: '', author: '' },
            builderResponses: ['', '', ''],
            storyPages: [{}, {}, {}, {}, {}, {}, {}]
          }
          
          await localDB.saveStory({
            id: storyId,
            userId: user.id,
            title: 'Untitled Story',
            bookData: initialData,
            lastModifiedAt: new Date().toISOString(),
            isDirty: true
          })
        }
      }
    } catch (error) {
      console.error('Error loading story:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      saveToLocal()
    }
  }, [coverData, builderResponses, storyPagesData])

  const saveToLocal = async () => {
    if (!user) return

    const storyData: TemplateStoryData = {
      coverData,
      builderResponses,
      storyPages: storyPagesData
    }

    await localDB.saveStory({
      id: storyId,
      userId: user.id,
      title: coverData.title || 'Untitled Story',
      bookData: storyData,
      lastModifiedAt: new Date().toISOString(),
      isDirty: true
    })
  }

  const saveToCloud = async () => {
    if (!user || !supabase) return

    setSaving(true)
    try {
      const storyData: TemplateStoryData = {
        coverData,
        builderResponses,
        storyPages: storyPagesData
      }

      const { error } = await supabase
        .from('stories')
        .upsert({
          id: storyId,
          user_id: user.id,
          title: coverData.title || 'Untitled Story',
          template_id: templateId,
          book_data: storyData,
          last_modified_at: new Date().toISOString()
        })

      if (error) throw error

      await localDB.markAsClean(storyId)
      alert('Story saved to cloud successfully!')
    } catch (error) {
      console.error('Error saving to cloud:', error)
      alert('Failed to save to cloud. Check console for details.')
    } finally {
      setSaving(false)
    }
  }

  const pages = [
    <CoverPage 
      key="cover" 
      title={coverData.title}
      author={coverData.author}
      onTitleChange={(title) => setCoverData(prev => ({ ...prev, title }))}
      onAuthorChange={(author) => setCoverData(prev => ({ ...prev, author }))}
    />,
    <InstructionsPage key="instructions" />,
    <StoryBuilderPage 
      key="builder"
      responses={builderResponses}
      onResponseChange={(index, value) => {
        const newResponses = [...builderResponses]
        newResponses[index] = value
        setBuilderResponses(newResponses)
      }}
    />,
    ...storyPrompts.map((prompt, index) => (
      <StoryPage 
        key={`story-${index}`}
        pageNumber={index + 1}
        prompt={prompt}
        imagePosition={index % 2 === 0 ? 'left' : 'right'}
        image={storyPagesData[index]?.image}
        text={storyPagesData[index]?.text}
        onImageChange={(image) => {
          const newData = [...storyPagesData]
          newData[index] = { ...newData[index], image }
          setStoryPagesData(newData)
        }}
        onTextChange={(text) => {
          const newData = [...storyPagesData]
          newData[index] = { ...newData[index], text }
          setStoryPagesData(newData)
        }}
      />
    ))
  ]

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <p className="text-2xl font-patrick">Loading your story...</p>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-md z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-patrick text-lg">Dashboard</span>
          </button>
          
          <div className="font-patrick text-xl text-gray-700">
            Page {currentPage + 1} of {pages.length}
          </div>

          <button
            onClick={saveToCloud}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-patrick"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save to Cloud'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        {pages[currentPage]}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-patrick text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentPage(index)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPage 
                    ? 'bg-purple-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === pages.length - 1}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-patrick text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  )
}
