import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { BookData, Page as PageType, Element, TextElement, ContentPage } from './types'
import Page from './components/Page'
import ControlBar from './components/ControlBar'
import ImageTray from './components/ImageTray'
import ViewModeToggle from './components/ViewModeToggle'
import SinglePageView from './components/SinglePageView'
import TwoPageView from './components/TwoPageView'
import { useAuth } from './contexts/AuthContext'
import { localDB } from './lib/localDB'
import { supabase } from './lib/supabase'
import './CreateStory.css'

function CreateStory() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [storyId] = useState(() => searchParams.get('id') || crypto.randomUUID())
  const [storyTitle, setStoryTitle] = useState('My Story')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('unsaved')
  
  // NEW: View mode state
  const [viewMode, setViewMode] = useState<'single' | 'two'>('single')
  
  const [bookData, setBookData] = useState<BookData>({
    canvas: { width: 1024, height: 768 },
    pages: [
      { type: 'cover', content: { title: 'My Awesome Story' } },
      {
        type: 'page',
        elements: [{
          type: 'text',
          content: '<h2>Chapter 1</h2><p>Click Edit to start writing!</p>',
          x: 4.88, y: 6.51, width: 29.30, height: 19.53, rotation: 0, zIndex: 1, id: 'el_1',
          fontFamily: 'nunito', fontWeight: 'normal', fontStyle: 'normal', textShape: 'rectangle',
          backgroundColor: 'rgba(230, 230, 230, 0.7)',
          color: '#000000',
          fontSize: 2.08
        }],
        background: { src: '', opacity: 1 }
      },
      { type: 'page', elements: [], background: { src: '', opacity: 1 } },
      { type: 'back-cover', content: {} }
    ]
  })
  
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [activePageIndex, setActivePageIndex] = useState(1)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [isImageTrayVisible, setIsImageTrayVisible] = useState(false)
  const [scale, setScale] = useState(1)
  const bookRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const loadStory = async () => {
      if (!user) return

      const localStory = await localDB.getStory(storyId)
      if (localStory) {
        setBookData(localStory.bookData)
        setStoryTitle(localStory.title)
        setSaveStatus(localStory.isDirty ? 'unsaved' : 'saved')
      }

      if (!supabase) return

      const { data: cloudStory } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single()

      if (cloudStory) {
        const cloudDate = new Date(cloudStory.last_modified_at)
        const localDate = localStory ? new Date(localStory.lastModifiedAt) : new Date(0)

        if (cloudDate > localDate) {
          setBookData(cloudStory.book_data)
          setStoryTitle(cloudStory.title)
          setSaveStatus('saved')

          await localDB.saveStory({
            id: cloudStory.id,
            userId: cloudStory.user_id,
            title: cloudStory.title,
            bookData: cloudStory.book_data,
            lastModifiedAt: cloudStory.last_modified_at,
            isDirty: false
          })
        }
      }
    }

    loadStory()
  }, [storyId, user])
  
  useEffect(() => {
    const saveToLocal = async () => {
      if (!user) return

      await localDB.saveStory({
        id: storyId,
        userId: user.id,
        title: storyTitle,
        bookData: bookData,
        isDirty: true
      })

      setSaveStatus('unsaved')
    }

    saveToLocal()
  }, [bookData, user, storyId, storyTitle])
  
  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current && bookData.canvas) {
        const container = containerRef.current
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        
        // Adjust for view mode - two page view needs more width
        const canvasWidth = viewMode === 'two' ? bookData.canvas.width : bookData.canvas.width / 2
        
        const scaleX = containerWidth / canvasWidth
        const scaleY = containerHeight / bookData.canvas.height
        const newScale = Math.min(scaleX, scaleY, 1)
        
        setScale(newScale)
      }
    }
    
    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [bookData.canvas, viewMode])
  
  // NEW: Toggle view mode and save edits
  const toggleViewMode = () => {
    if (viewMode === 'single' && isEditMode) {
      // Save edits before switching to two-page view
      setIsEditMode(false)
      setSelectedElement(null)
    }
    setViewMode(viewMode === 'single' ? 'two' : 'single')
  }
  
  const toggleEditMode = () => {
    // Only allow edit mode in single page view
    if (viewMode === 'two') {
      setViewMode('single')
    }
    setIsEditMode(!isEditMode)
    setSelectedElement(null)
  }
