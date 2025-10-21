import Page from './Page'
import { BookData, Element } from '../types'
import { RefObject } from 'react'

interface TwoPageViewProps {
  containerRef: RefObject<HTMLDivElement>
  bookRef: RefObject<HTMLDivElement>
  bookData: BookData
  currentPageIndex: number
  selectElement: (element: Element | null) => void
  updateElement: (element: Element) => void
  scale: number
}

export default function TwoPageView({
  containerRef,
  bookRef,
  bookData,
  currentPageIndex,
  selectElement,
  updateElement,
  scale
}: TwoPageViewProps) {
  const leftPageIndex = currentPageIndex
  const rightPageIndex = currentPageIndex + 1
  const hasRightPage = rightPageIndex < bookData.pages.length

  // Check if pages are cover or back cover (full width pages)
  const isLeftPageFullWidth = leftPageIndex === 0 || leftPageIndex === bookData.pages.length - 1
  const isRightPageFullWidth = rightPageIndex === bookData.pages.length - 1

  const leftPageWidth = isLeftPageFullWidth ? bookData.canvas.width : bookData.canvas.width / 2
  const rightPageWidth = isRightPageFullWidth ? bookData.canvas.width : bookData.canvas.width / 2

  return (
    <div
      ref={containerRef}
      className="book-container w-full max-w-[90vw] relative mb-2 flex items-center justify-center"
      style={{ height: 'clamp(400px, 85vh, 900px)' }}
    >
      <div
        ref={bookRef}
        className="book-spread flex shadow-2xl"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease'
        }}
      >
        <div
          className="page-left relative bg-white"
          style={{
            width: `${leftPageWidth}px`,
            height: `${bookData.canvas.height}px`,
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            borderRight: '1px solid #e0e0e0'
          }}
        >
          <Page
            pageData={bookData.pages[leftPageIndex]}
            pageIndex={leftPageIndex}
            face="front"
            canvas={{ width: leftPageWidth, height: bookData.canvas.height }}
            isEditMode={false}
            isActive={false}
            selectedElement={null}
            onSelectElement={selectElement}
            onUpdateElement={updateElement}
          />

          <div
            className="absolute top-0 right-0 w-8 h-full pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.05))',
              opacity: 0.5
            }}
          />
        </div>

        <div
          className="book-gutter"
          style={{
            width: '4px',
            height: `${bookData.canvas.height}px`,
            background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05), rgba(0,0,0,0.1))',
            position: 'relative'
          }}
        />

        {hasRightPage && (
          <div
            className="page-right relative bg-white"
            style={{
              width: `${rightPageWidth}px`,
              height: `${bookData.canvas.height}px`,
              boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
              borderLeft: '1px solid #e0e0e0'
            }}
          >
            <Page
              pageData={bookData.pages[rightPageIndex]}
              pageIndex={rightPageIndex}
              face="front"
              canvas={{ width: rightPageWidth, height: bookData.canvas.height }}
              isEditMode={false}
              isActive={false}
              selectedElement={null}
              onSelectElement={selectElement}
              onUpdateElement={updateElement}
            />

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