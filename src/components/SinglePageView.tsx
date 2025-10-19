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
  const isFullWidthPage = currentPageIndex === 0 || currentPageIndex === bookData.pages.length - 1
  const pageWidth = isFullWidthPage ? bookData.canvas.width : bookData.canvas.width / 2
  
  return (
    <div
      ref={containerRef}
      className="book-container w-full max-w-[1000px] h-[600px] md:h-[600px] relative mb-2 flex items-center justify-center"
      style={{ height: 'clamp(300px, 80vh, 600px)' }}
      onDrop={(e) => handleDrop(e, currentPageIndex)}
      onDragOver={handleDragOver}
    >
      <div 
        ref={bookRef}
        className="book relative bg-white shadow-2xl"
        style={{ 
          width: `${pageWidth}px`,
          height: `${bookData.canvas.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <Page
          pageData={bookData.pages[currentPageIndex]}
          pageIndex={currentPageIndex}
          face="front"
          canvas={{ width: pageWidth, height: bookData.canvas.height }}
          isEditMode={isEditMode}
          isActive={activePageIndex === currentPageIndex}
          selectedElement={selectedElement}
          onSelectElement={selectElement}
          onUpdateElement={updateElement}
        />
      </div>
    </div>
  )
}
