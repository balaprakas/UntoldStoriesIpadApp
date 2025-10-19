import Page from './Page'
import { BookData, Element, ContentPage } from '../types'

interface SinglePageViewProps {
  bookData: BookData
  currentPageIndex: number
  isEditMode: boolean
  selectedElement: Element | null
  onSelectElement: (element: Element | null) => void
  onUpdateElement: (pageIndex: number, elementId: string, updates: Partial<Element>) => void
  onDrop: (e: React.DragEvent, pageIndex: number) => void
  onDragOver: (e: React.DragEvent) => void
  scale: number
}

export default function SinglePageView({
  bookData,
  currentPageIndex,
  isEditMode,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDrop,
  onDragOver,
  scale
}: SinglePageViewProps) {
  return (
    <div
      className="single-page-view w-full h-full flex items-center justify-center"
      onDrop={(e) => onDrop(e, currentPageIndex)}
      onDragOver={onDragOver}
    >
      <div
        className="page-container bg-white shadow-2xl"
        style={{
          width: `${bookData.canvas.width}px`,
          height: `${bookData.canvas.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease'
        }}
      >
        <Page
          pageData={bookData.pages[currentPageIndex]}
          pageIndex={currentPageIndex}
          face="front"
          canvas={bookData.canvas}
          isEditMode={isEditMode}
          isActive={true}
          selectedElement={selectedElement}
          onSelectElement={onSelectElement}
          onUpdateElement={onUpdateElement}
        />
      </div>
    </div>
  )
}
