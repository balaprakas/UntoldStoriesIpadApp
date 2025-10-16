import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BookData, Page as PageType, Element, TextElement, ContentPage } from './types'
import Page from './components/Page'
import ControlBar from './components/ControlBar'
import ImageTray from './components/ImageTray'
import './CreateStory.css'

function CreateStory() {
  const navigate = useNavigate()
  const [bookData, setBookData] = useState<BookData>({
    canvas: { width: 1024, height: 768 },
    pages: [
      { type: 'cover', content: { title: 'My Awesome Story' } },
      {
        type: 'page',
        elements: [{
          type: 'text',
          content: '<h2>Chapter 1</h2><p>Click Edit to start writing!</p>',
          x: 50, y: 50, width: 300, height: 150, rotation: 0, zIndex: 1, id: 'el_1',
          fontFamily: 'nunito', fontWeight: 'normal', fontStyle: 'normal', textShape: 'rectangle',
          backgroundColor: 'rgba(230, 230, 230, 0.7)',
          color: '#000000',
          fontSize: 16
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
    const saved = localStorage.getItem('storybook-data')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        if (!parsedData.canvas) {
          parsedData.canvas = { width: 1024, height: 768 }
        }
        setBookData(parsedData)
      } catch (e) {
        console.error('Failed to load saved data')
      }
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('storybook-data', JSON.stringify(bookData))
  }, [bookData])
  
  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current && bookData.canvas) {
        const container = containerRef.current
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        
        const scaleX = containerWidth / bookData.canvas.width
        const scaleY = containerHeight / bookData.canvas.height
        const newScale = Math.min(scaleX, scaleY, 1)
        
        setScale(newScale)
      }
    }
    
    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [bookData.canvas])
  
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setSelectedElement(null)
  }
  
  const addTextElement = () => {
    if (!isEditMode) return
    
    const pageIndex = activePageIndex
    const page = bookData.pages[pageIndex] as ContentPage
    if (page.type !== 'page') return
    
    const newElement: TextElement = {
      type: 'text',
      content: 'New text',
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      rotation: 0,
      zIndex: page.elements.length + 1,
      id: `el_${Date.now()}`,
      fontFamily: 'nunito',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textShape: 'rectangle',
      backgroundColor: 'rgba(230, 230, 230, 0.7)',
      color: '#000000',
      fontSize: 16
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
    
    const newElement = {
      type: 'image' as const,
      src: imageUrl,
      x: 100,
      y: 100,
      width: 200,
      height: 200,
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
  
  const selectElement = (element: Element) => {
    setSelectedElement(element)
    
    for (let i = 0; i < bookData.pages.length; i++) {
      const page = bookData.pages[i]
      if (page.type === 'page' && page.elements.some(el => el.id === element.id)) {
        setActivePageIndex(i)
        break
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
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale - 100
    const y = (e.clientY - rect.top) / scale - 100
    
    const newElement = {
      type: 'image' as const,
      src: imageUrl,
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: 200,
      height: 200,
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
    if (direction === 'next' && currentPageIndex < bookData.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    } else if (direction === 'prev' && currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }
  
  return (
    <div className="min-h-screen bg-[#dad7cd] flex flex-col items-center justify-center py-8 px-4">
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>
      
      <div 
        ref={containerRef}
        className="book-container w-full max-w-[1000px] h-[600px] relative mb-32 flex items-center justify-center"
      >
        <div 
          ref={bookRef}
          className="book relative bg-white shadow-2xl"
          style={{ 
            transformStyle: 'preserve-3d',
            width: `${bookData.canvas.width}px`,
            height: `${bookData.canvas.height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {currentPageIndex === 0 && (
            <div className="page-sheet absolute w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
              <Page
                pageData={bookData.pages[0]}
                pageIndex={0}
                face="front"
                isEditMode={isEditMode}
                isActive={activePageIndex === 0}
                onSelectElement={selectElement}
                onUpdateElement={updateElement}
              />
            </div>
          )}
          
          {currentPageIndex > 0 && currentPageIndex < bookData.pages.length && (
            <>
              <div className="page-left absolute left-0 w-1/2 h-full"
                   onDrop={(e) => handleDrop(e, currentPageIndex)}
                   onDragOver={handleDragOver}>
                <Page
                  pageData={bookData.pages[currentPageIndex]}
                  pageIndex={currentPageIndex}
                  face="front"
                  isEditMode={isEditMode}
                  isActive={activePageIndex === currentPageIndex}
                  onSelectElement={selectElement}
                  onUpdateElement={updateElement}
                />
              </div>
              
              {currentPageIndex + 1 < bookData.pages.length && (
                <div className="page-right absolute right-0 w-1/2 h-full"
                     onDrop={(e) => handleDrop(e, currentPageIndex + 1)}
                     onDragOver={handleDragOver}>
                  <Page
                    pageData={bookData.pages[currentPageIndex + 1]}
                    pageIndex={currentPageIndex + 1}
                    face="front"
                    isEditMode={isEditMode}
                    isActive={activePageIndex === currentPageIndex + 1}
                    onSelectElement={selectElement}
                    onUpdateElement={updateElement}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 w-full max-w-[1000px]">
        <button
          onClick={() => flipPage('prev')}
          disabled={currentPageIndex === 0}
          className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors font-semibold"
        >
          ← Previous
        </button>
        
        <span className="text-gray-600 font-semibold">
          Page {currentPageIndex + 1} - {Math.min(currentPageIndex + 2, bookData.pages.length)} of {bookData.pages.length}
        </span>
        
        <button
          onClick={() => flipPage('next')}
          disabled={currentPageIndex >= bookData.pages.length - 2}
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
