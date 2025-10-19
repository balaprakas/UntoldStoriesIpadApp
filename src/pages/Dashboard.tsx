import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { localDB } from '../lib/localDB'
import { supabase } from '../lib/supabase'
import { LogOut, Plus, Edit, Trash2 } from 'lucide-react'
import TemplateSelectionModal from '../components/TemplateSelectionModal'

interface Story {
  id: string
  title: string
  lastModifiedAt: string
  isDirty: boolean
  templateId?: string
}

function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  useEffect(() => {
    loadStories()
  }, [user])

  const loadStories = async () => {
    if (!user) return

    // Load from IndexedDB first (fast!)
    const localStories = await localDB.getAllStories(user.id)
    setStories(localStories.map(s => ({
      id: s.id,
      title: s.title,
      lastModifiedAt: s.lastModifiedAt,
      isDirty: s.isDirty,
      templateId: s.templateId
    })))
    setLoading(false)

    // Then sync from Supabase in background
    if (!supabase) return

    const { data, error } = await supabase
      .from('stories')
      .select('id, title, last_modified_at')
      .order('created_at', { ascending: false })

    if (data && !error) {
      // Update local with cloud data if needed
      for (const cloudStory of data) {
        const localStory = await localDB.getStory(cloudStory.id)
        if (!localStory || new Date(cloudStory.last_modified_at) > new Date(localStory.lastModifiedAt)) {
          // Cloud version is newer, fetch full data
          const { data: fullStory } = await supabase
            .from('stories')
            .select('*')
            .eq('id', cloudStory.id)
            .single()

          if (fullStory) {
            await localDB.saveStory({
              id: fullStory.id,
              userId: fullStory.user_id,
              title: fullStory.title,
              bookData: fullStory.book_data,
              lastModifiedAt: fullStory.last_modified_at,
              isDirty: false
            })
          }
        }
      }

      // Reload from IndexedDB
      const updatedStories = await localDB.getAllStories(user.id)
      setStories(updatedStories.map(s => ({
        id: s.id,
        title: s.title,
        lastModifiedAt: s.lastModifiedAt,
        isDirty: s.isDirty,
        templateId: s.templateId
      })))
    }
  }

 const handleCreateNew = () => {
   setShowTemplateModal(true); // Open modal instead
 };

  const handleEdit = async (storyId: string) => {
    const story = await localDB.getStory(storyId)
    if (story?.templateId) {
      navigate(`/create-template-story/${story.templateId}?id=${storyId}`)
    } else {
      navigate(`/create-story?id=${storyId}`)
    }
  }

  const handleDelete = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return

    // Delete from IndexedDB
    await localDB.deleteStory(storyId)

    // Delete from Supabase
    if (supabase) {
      await supabase.from('stories').delete().eq('id', storyId)
    }

    // Reload stories
    loadStories()
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#dad7cd] flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#dad7cd] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.email?.split('@')[0]}!
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors mb-6"
        >
          <Plus size={20} />
          Create New Story
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">No stories yet. Create your first story!</p>
            </div>
          ) : (
            stories.map((story) => (
              <div
                key={story.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Modified: {new Date(story.lastModifiedAt).toLocaleDateString()}
                </p>
                <div className="mb-4">
                  {story.isDirty ? (
                    <span className="text-orange-600 text-sm">⚠ Not saved to cloud</span>
                  ) : (
                    <span className="text-green-600 text-sm">✓ Saved</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(story.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <TemplateSelectionModal
          onClose={() => setShowTemplateModal(false)}
          onSelectBlank={() => {
            setShowTemplateModal(false)
            navigate('/create-story')
          }}
          onSelectTemplate={(templateId) => {
            setShowTemplateModal(false)
            navigate(`/create-template-story/${templateId}`)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard
