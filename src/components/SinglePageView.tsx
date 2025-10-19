import Page from './Page'
import { BookData, Element } from '../types'
import { RefObject } from 'react'

interface SinglePageViewProps {
  containerRef: RefObject<HTMLDivElement>
  bookRef: RefObject<HTMLDivElement>
  bookData: BookData
  currentPageIndex: number
  activePageIndex: number
  isEditMode: boolean
  selectedElement: Element | null
  selectElement: (element: Element | null) => void
  updateElement: (element: Element) => void
  handleDrop: (e: React.DragEvent, pageIndex: number) => void
  handleDragOver: (e: React.DragEvent) => void
  scale: number
}

export default function SinglePageView({
  containerRef,
  bookRef,
  bookData,
  currentPageIndex,
  activePageIndex,
  isEditMode,
  selectedElement,
  selectElement,
  updateElement,
  handleDrop,
  handleDragOver,
  scale
}: SinglePageViewProps) {
  return (
    <div
      ref={containerRef}
      className="book-container w-full max-w-[1000px] h-[600px] md:h-[600px] relative mb-2 flex items-center justify-center"
      style={{ height: 'clamp(300px, 80vh, 600px)' }}
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
              canvas={bookData.canvas}
              isEditMode={isEditMode}
              isActive={activePageIndex === 0}
              selectedElement={selectedElement}
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
                canvas={bookData.canvas}
                isEditMode={isEditMode}
                isActive={activePageIndex === currentPageIndex}
                selectedElement={selectedElement}
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
                  canvas={bookData.canvas}
                  isEditMode={isEditMode}
                  isActive={activePageIndex === currentPageIndex + 1}
                  selectedElement={selectedElement}
                  onSelectElement={selectElement}
                  onUpdateElement={updateElement}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
