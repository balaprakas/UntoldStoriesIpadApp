import Page from './Page'
import { BookData, Element } from '../types'

interface TwoPageViewProps {
  bookData: BookData
  currentPageIndex: number
  selectedElement: Element | null
  onSelectElement: (element: Element | null) => void
  onUpdateElement: (pageIndex: number, elementId: string, updates: Partial<Element>) => void
  scale: number
}

export default function TwoPageView({
  bookData,
  currentPageIndex,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  scale
}: TwoPageViewProps) {
  const leftPageIndex = currentPageIndex
  const rightPageIndex = currentPageIndex + 1
  const hasRightPage = rightPageIndex < bookData.pages.length

  return (
    <div className="two-page-view w-full h-full flex items-center justify-center perspective-container">
      <div
        className="book-spread flex shadow-2xl"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Left Page */}
        <div
          className="page-left relative bg-white"
          style={{
            width: `${bookData.canvas.width / 2}px`,
            height: `${bookData.canvas.height}px`,
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            borderRight: '1px solid #e0e0e0'
          }}
        >
          <Page
            pageData={bookData.pages[leftPageIndex]}
            pageIndex={leftPageIndex}
            face="front"
            canvas={{ ...bookData.canvas, width: bookData.canvas.width / 2 }}
            isEditMode={false}
            isActive={false}
            selectedElement={selectedElement}
            onSelectElement={onSelectElement}
            onUpdateElement={onUpdateElement}
          />
          
          {/* Page shadow effect */}
          <div
            className="absolute top-0 right-0 w-8 h-full pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.05))',
              opacity: 0.5
            }}
          />
        </div>

        {/* Center Gutter */}
        <div
          className="book-gutter"
          style={{
            width: '4px',
            height: `${bookData.canvas.height}px`,
            background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05), rgba(0,0,0,0.1))',
            position: 'relative'
          }}
        />

        {/* Right Page */}
        {hasRightPage && (
          <div
            className="page-right relative bg-white"
            style={{
              width: `${bookData.canvas.width / 2}px`,
              height: `${bookData.canvas.height}px`,
              boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
              borderLeft: '1px solid #e0e0e0'
            }}
          >
            <Page
              pageData={bookData.pages[rightPageIndex]}
              pageIndex={rightPageIndex}
              face="front"
              canvas={{ ...bookData.canvas, width: bookData.canvas.width / 2 }}
              isEditMode={false}
              isActive={false}
              selectedElement={selectedElement}
              onSelectElement={onSelectElement}
              onUpdateElement={onUpdateElement}
            />
            
            {/* Page shadow effect */}
            <div
              className="absolute top-0 left-0 w-8 h-full pointer-events-none"
              style={{
                background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.05))',
                opacity: 0.5
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
