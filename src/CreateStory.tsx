import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BookData, Page as PageType, Element, TextElement, ContentPage } from './types'
import Page from './components/Page'
import ControlBar from './components/ControlBar'
import './CreateStory.css'

function CreateStory() {
  const navigate = useNavigate()
  const [bookData, setBookData] = useState<BookData>({
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
  const bookRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const saved = localStorage.getItem('storybook-data')
    if (saved) {
      try {
        setBookData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved data')
      }
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('storybook-data', JSON.stringify(bookData))
  }, [bookData])
  
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
  
  const addImageElement = () => {
    const imageUrl = prompt('Enter image URL:')
    if (!imageUrl || !isEditMode) return
    
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
      
      <div className="book-container w-full max-w-[1000px] h-[600px] relative mb-32">
        <div 
          ref={bookRef}
          className="book w-full h-full relative bg-white shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
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
              <div className="page-left absolute left-0 w-1/2 h-full">
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
                <div className="page-right absolute right-0 w-1/2 h-full">
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
        
        <div className="flex justify-between items-center mt-4">
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
      </div>
      
      <ControlBar
        isEditMode={isEditMode}
        selectedElement={selectedElement}
        onToggleEditMode={toggleEditMode}
        onAddText={addTextElement}
        onAddImage={addImageElement}
        onDeleteElement={deleteSelectedElement}
        onAddPage={addPage}
        onExportJSON={exportJSON}
        onBringForward={bringForward}
        onSendBackward={sendBackward}
        onUpdateTextProperty={updateTextProperty}
      />
    </div>
  )
}

export default CreateStory
