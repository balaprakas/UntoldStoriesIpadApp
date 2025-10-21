import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { BookData, Page as PageType, Element, TextElement, ContentPage } from './types'
import ControlBar from './components/ControlBar'
import ImageTray from './components/ImageTray'
import ViewModeToggle from './components/ViewModeToggle'
import SinglePageView from './components/SinglePageView'
import TwoPageView from './components/TwoPageView'
import { useAuth } from './contexts/AuthContext'
import { localDB } from './lib/localDB'
import { supabase } from './lib/supabase'
import './CreateStory.css'
import './ViewMode.css'

function CreateStory() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [storyId] = useState(() => searchParams.get('id') || crypto.randomUUID())
  const [storyTitle, setStoryTitle] = useState('My Story')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('unsaved')
  
  const [viewMode, setViewMode] = useState<'single' | 'two'>('two')

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

  const isOnCoverPage = currentPageIndex === 0
  const actualViewMode = isOnCoverPage ? 'single' : (isEditMode ? 'single' : viewMode)

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current && bookData.canvas) {
        const container = containerRef.current
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        const canvasWidth = actualViewMode === 'two' ? bookData.canvas.width : bookData.canvas.width / 2

        const scaleX = (containerWidth * 0.95) / canvasWidth
        const scaleY = (containerHeight * 0.95) / bookData.canvas.height
        const newScale = Math.min(scaleX, scaleY)

        setScale(newScale)
      }
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [bookData.canvas, actualViewMode])

  const toggleViewMode = () => {
    if (isOnCoverPage) return
    
    if (viewMode === 'single' && isEditMode) {
      setIsEditMode(false)
      setSelectedElement(null)
    }
    setViewMode(viewMode === 'single' ? 'two' : 'single')
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setSelectedElement(null)
  }

  const addTextElement = () => {
    if (!isEditMode) return

    const pageIndex = activePageIndex
    const page = bookData.pages[pageIndex] as ContentPage
    if (page.type !== 'page') return

    const isFullWidthPage = pageIndex === 0 || pageIndex === bookData.pages.length - 1
    const pageWidth = isFullWidthPage ? bookData.canvas.width : bookData.canvas.width / 2

    const pixelsToPercentForPage = (pixels: number, dimension: 'width' | 'height') => {
      const base = dimension === 'width' ? pageWidth : bookData.canvas.height
      return (pixels / base) * 100
    }

    const newElement: TextElement = {
      type: 'text',
      content: 'New text',
      x: pixelsToPercentForPage(100, 'width'),
      y: pixelsToPercentForPage(100, 'height'),
      width: pixelsToPercentForPage(200, 'width'),
      height: pixelsToPercentForPage(100, 'height'),
      rotation: 0,
      zIndex: page.elements.length + 1,
      id: `el_${Date.now()}`,
      fontFamily: 'nunito',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textShape: 'rectangle',
      backgroundColor: 'rgba(230, 230, 230, 0.7)',
      color: '#000000',
      fontSize: pixelsToPercentForPage(16, 'width')
    }

    const newPages = [...bookData.pages]
    const updatedPage = { ...page, elements: [...page.elements, newElement] }
    newPages[pageIndex] = updatedPage
    setBookData({ ...bookData, pages: newPages })
    setSelectedElement(newElement)
  }

  const toggleImageTray = () => {
    setIsImageTrayVisible(!isImageTrayVisible)
  }

  const addImageFromUrl = (imageUrl: string) => {
    if (!isEditMode) return

    const pageIndex = activePageIndex
    const page = bookData.pages[pageIndex] as ContentPage
    if (page.type !== 'page') return

    const isFullWidthPage = pageIndex === 0 || pageIndex === bookData.pages.length - 1
    const pageWidth = isFullWidthPage ? bookData.canvas.width : bookData.canvas.width / 2

    const pixelsToPercentForPage = (pixels: number, dimension: 'width' | 'height') => {
      const base = dimension === 'width' ? pageWidth : bookData.canvas.height
      return (pixels / base) * 100
    }

    const newElement = {
      type: 'image' as const,
      src: imageUrl,
      x: pixelsToPercentForPage(100, 'width'),
      y: pixelsToPercentForPage(100, 'height'),
      width: pixelsToPercentForPage(200, 'width'),
      height: pixelsToPercentForPage(200, 'height'),
      rotation: 0,
      zIndex: page.elements.length + 1,
      id: `el_${Date.now()}`,
      imageFrame: 'none' as const
    }

    const newPages = [...bookData.pages]
    const updatedPage = { ...page, elements: [...page.elements, newElement] }
    newPages[pageIndex] = updatedPage
    setBookData({ ...bookData, pages: newPages })
    setSelectedElement(newElement)
    setIsImageTrayVisible(false)
  }

  const deleteSelectedElement = () => {
    if (!selectedElement || !isEditMode) return

    const newPages = bookData.pages.map(page => {
      if (page.type === 'page') {
        return {
          ...page,
          elements: page.elements.filter(el => el.id !== selectedElement.id)
        }
      }
      return page
    })

    setBookData({ ...bookData, pages: newPages })
    setSelectedElement(null)
  }

  const updateElement = (updatedElement: Element) => {
    const newPages = bookData.pages.map(page => {
      if (page.type === 'page') {
        return {
          ...page,
          elements: page.elements.map(el =>
            el.id === updatedElement.id ? updatedElement : el
          )
        }
      }
      return page
    })

    setBookData({ ...bookData, pages: newPages })
    if (selectedElement?.id === updatedElement.id) {
      setSelectedElement(updatedElement)
    }
  }

  const selectElement = (element: Element | null) => {
    setSelectedElement(element)

    if (element) {
      for (let i = 0; i < bookData.pages.length; i++) {
        const page = bookData.pages[i]
        if (page.type === 'page' && page.elements.some(el => el.id === element.id)) {
          setActivePageIndex(i)
          break
        }
      }
    }
  }

  const addPage = () => {
    if (!isEditMode) return

    const newPages: PageType[] = [
      ...bookData.pages.slice(0, -1),
      { type: 'page', elements: [], background: { src: '', opacity: 1 } },
      { type: 'page', elements: [], background: { src: '', opacity: 1 } },
      bookData.pages[bookData.pages.length - 1]
    ]

    setBookData({ ...bookData, pages: newPages })
  }

  const exportJSON = () => {
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookData, null, 2))
    const link = document.createElement('a')
    link.href = dataUri
    link.download = 'my-storybook.json'
    link.click()
  }

  const bringForward = () => {
    if (!selectedElement || !isEditMode) return

    const newPages = bookData.pages.map(page => {
      if (page.type === 'page') {
        const elements = page.elements.map(el => {
          if (el.id === selectedElement.id) {
            return { ...el, zIndex: el.zIndex + 1 }
          }
          return el
        })
        return { ...page, elements }
      }
      return page
    })

    setBookData({ ...bookData, pages: newPages })
  }

  const sendBackward = () => {
    if (!selectedElement || !isEditMode) return

    const newPages = bookData.pages.map(page => {
      if (page.type === 'page') {
        const elements = page.elements.map(el => {
          if (el.id === selectedElement.id && el.zIndex > 1) {
            return { ...el, zIndex: el.zIndex - 1 }
          }
          return el
        })
        return { ...page, elements }
      }
      return page
    })

    setBookData({ ...bookData, pages: newPages })
  }

  const updateTextProperty = <K extends keyof TextElement>(property: K, value: TextElement[K]) => {
    if (!selectedElement || selectedElement.type !== 'text') return

    const updatedElement = { ...selectedElement, [property]: value }
    updateElement(updatedElement)
  }

  const handleDrop = (e: React.DragEvent, pageIndex: number) => {
    e.preventDefault()
    if (!isEditMode) return

    const imageUrl = e.dataTransfer.getData('text/plain')
    if (!imageUrl) return

    const page = bookData.pages[pageIndex] as ContentPage
    if (page.type !== 'page') return

    const isFullWidthPage = pageIndex === 0 || pageIndex === bookData.pages.length - 1
    const pageWidth = isFullWidthPage ? bookData.canvas.width : bookData.canvas.width / 2

    const pixelsToPercentForPage = (pixels: number, dimension: 'width' | 'height') => {
      const base = dimension === 'width' ? pageWidth : bookData.canvas.height
      return (pixels / base) * 100
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const xPixels = (e.clientX - rect.left) / scale - 100
    const yPixels = (e.clientY - rect.top) / scale - 100

    const newElement = {
      type: 'image' as const,
      src: imageUrl,
      x: Math.max(0, pixelsToPercentForPage(xPixels, 'width')),
      y: Math.max(0, pixelsToPercentForPage(yPixels, 'height')),
      width: pixelsToPercentForPage(200, 'width'),
      height: pixelsToPercentForPage(200, 'height'),
      rotation: 0,
      zIndex: page.elements.length + 1,
      id: `el_${Date.now()}`,
      imageFrame: 'none' as const
    }

    const newPages = [...bookData.pages]
    const updatedPage = { ...page, elements: [...page.elements, newElement] }
    newPages[pageIndex] = updatedPage
    setBookData({ ...bookData, pages: newPages })
    setSelectedElement(newElement)
    setIsImageTrayVisible(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handlePageBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !isEditMode) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      const newPages = bookData.pages.map((page, idx) => {
        if (idx === activePageIndex && page.type === 'page') {
          return { ...page, background: { src: imageUrl, opacity: page.background.opacity || 1 } }
        }
        return page
      })
      setBookData({ ...bookData, pages: newPages })
    }
    reader.readAsDataURL(file)
  }

  const handlePageBgOpacity = (opacity: number) => {
    if (!isEditMode) return
    const newPages = bookData.pages.map((page, idx) => {
      if (idx === activePageIndex && page.type === 'page') {
        return { ...page, background: { ...page.background, opacity } }
      }
      return page
    })
    setBookData({ ...bookData, pages: newPages })
  }

  const removePageBg = () => {
    if (!isEditMode) return
    const newPages = bookData.pages.map((page, idx) => {
      if (idx === activePageIndex && page.type === 'page') {
        return { ...page, background: { src: '', opacity: 1 } }
      }
      return page
    })
    setBookData({ ...bookData, pages: newPages })
  }

  const increaseFontSize = () => {
    if (!selectedElement || selectedElement.type !== 'text') return
    const currentSize = selectedElement.fontSize || 16
    const newSize = Math.min(72, currentSize + 2)
    updateTextProperty('fontSize', newSize)
  }

  const decreaseFontSize = () => {
    if (!selectedElement || selectedElement.type !== 'text') return
    const currentSize = selectedElement.fontSize || 16
    const newSize = Math.max(8, currentSize - 2)
    updateTextProperty('fontSize', newSize)
  }

  const updateTextBgColor = (color: string) => {
    if (!selectedElement || selectedElement.type !== 'text') return
    const rgba = hexToRgba(color, getTextBgOpacity())
    updateTextProperty('backgroundColor', rgba)
  }

  const updateTextBgOpacity = (opacity: number) => {
    if (!selectedElement || selectedElement.type !== 'text') return
    const color = getTextBgColor()
    const rgba = hexToRgba(color, opacity)
    updateTextProperty('backgroundColor', rgba)
  }

  const getTextBgColor = (): string => {
    if (!selectedElement || selectedElement.type !== 'text') return '#e6e6e6'
    const bg = selectedElement.backgroundColor
    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match) {
      return `#${((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1)}`
    }
    return '#e6e6e6'
  }

  const getTextBgOpacity = (): number => {
    if (!selectedElement || selectedElement.type !== 'text') return 0.7
    const bg = selectedElement.backgroundColor
    const match = bg.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/)
    return match ? parseFloat(match[1]) : 1
  }

  const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  const updateImageFrame = (frame: string) => {
    if (!selectedElement || selectedElement.type !== 'image') return
    const updatedElement = { ...selectedElement, imageFrame: frame as any }
    updateElement(updatedElement)
  }

  const flipPage = (direction: 'next' | 'prev') => {
    const step = actualViewMode === 'two' ? 2 : 1
    if (direction === 'next' && currentPageIndex < bookData.pages.length - step) {
      setCurrentPageIndex(currentPageIndex + step)
    } else if (direction === 'prev' && currentPageIndex > 0) {
      setCurrentPageIndex(Math.max(0, currentPageIndex - step))
    }
  }

  const saveToCloud = async () => {
    if (!user) return

    if (!supabase) {
      alert('Cloud sync is not configured.')
      return
    }

    setIsSaving(true)
    setSaveStatus('saving')

    try {
      const { error } = await supabase
        .from('stories')
        .upsert({
          id: storyId,
          user_id: user.id,
          title: storyTitle,
          book_data: bookData,
          last_modified_at: new Date().toISOString()
        })

      if (error) throw error

      await localDB.markAsClean(storyId)
      setSaveStatus('saved')
      alert('Story saved to cloud successfully!')
    } catch (error) {
      console.error('Error saving to cloud:', error)
      alert('Failed to save to cloud. Check console for details.')
      setSaveStatus('unsaved')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#dad7cd] flex flex-col items-center justify-center py-8 px-4">
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow z-50"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <button
        onClick={saveToCloud}
        disabled={isSaving}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:bg-gray-400 z-50"
      >
        <Save size={20} />
        {isSaving ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved' : '💾 Save to Cloud'}
      </button>

      {!isOnCoverPage && <ViewModeToggle viewMode={viewMode} onToggle={toggleViewMode} />}

      {actualViewMode === 'single' ? (
        <SinglePageView
          containerRef={containerRef}
          bookRef={bookRef}
          bookData={bookData}
          currentPageIndex={currentPageIndex}
          activePageIndex={activePageIndex}
          scale={scale}
          isEditMode={isEditMode}
          selectedElement={selectedElement}
          selectElement={selectElement}
          updateElement={updateElement}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
        />
      ) : (
        <TwoPageView
          containerRef={containerRef}
          bookRef={bookRef}
          bookData={bookData}
          currentPageIndex={currentPageIndex}
          scale={scale}
          selectElement={selectElement}
          updateElement={updateElement}
        />
      )}

      <div className="flex justify-between items-center mt-2 mb-24 w-full max-w-[1000px] relative z-10">
        <button
          onClick={() => flipPage('prev')}
          disabled={currentPageIndex === 0}
          className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors font-semibold"
        >
          ← Previous
        </button>

        <span className="text-gray-600 font-semibold">
          {actualViewMode === 'two'
            ? `Pages ${currentPageIndex + 1}-${Math.min(currentPageIndex + 2, bookData.pages.length)} of ${bookData.pages.length}`
            : `Page ${currentPageIndex + 1} of ${bookData.pages.length}`
          }
        </span>

        <button
          onClick={() => flipPage('next')}
          disabled={actualViewMode === 'two' ? currentPageIndex >= bookData.pages.length - 2 : currentPageIndex >= bookData.pages.length - 1}
          className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors font-semibold"
        >
          Next →
        </button>
      </div>

      <ControlBar
        isEditMode={isEditMode}
        selectedElement={selectedElement}
        currentPage={bookData.pages[activePageIndex] as ContentPage}
        onToggleEditMode={toggleEditMode}
        onAddText={addTextElement}
        onAddImage={toggleImageTray}
        onDeleteElement={deleteSelectedElement}
        onAddPage={addPage}
        onExportJSON={exportJSON}
        onBringForward={bringForward}
        onSendBackward={sendBackward}
        onUpdateTextProperty={updateTextProperty}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
        onUpdateTextBgColor={updateTextBgColor}
        onUpdateTextBgOpacity={updateTextBgOpacity}
        onUpdateImageFrame={updateImageFrame}
        onPageBgUpload={handlePageBgUpload}
        onPageBgOpacity={handlePageBgOpacity}
        onRemovePageBg={removePageBg}
      />

      <ImageTray isVisible={isImageTrayVisible} onImageSelect={addImageFromUrl} />
    </div>
  )
}

export default CreateStory
