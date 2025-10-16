import { Page as PageType, Element, CanvasSize } from '../types'
import TextElement from './TextElement'
import ImageElement from './ImageElement'

interface PageProps {
  pageData: PageType;
  pageIndex: number;
  face: 'front' | 'back';
  canvas: CanvasSize;
  isEditMode: boolean;
  isActive: boolean;
  onSelectElement: (element: Element) => void;
  onUpdateElement: (element: Element) => void;
}

function Page({ pageData, pageIndex, face, canvas, isEditMode, isActive, onSelectElement, onUpdateElement }: PageProps) {
  if (pageData.type === 'cover') {
    return (
      <div className={`page-${face} absolute w-full h-full p-6 bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center flex-col`}
           style={{ backfaceVisibility: 'hidden' }}>
        <h1 className="text-white text-4xl md:text-5xl font-bold text-center drop-shadow-lg">
          {pageData.content.title}
        </h1>
      </div>
    )
  }
  
  if (pageData.type === 'back-cover') {
    return (
      <div className={`page-${face} absolute w-full h-full p-6 bg-gradient-to-br from-green-600 to-green-700`}
           style={{ backfaceVisibility: 'hidden' }}>
      </div>
    )
  }

  const bgStyle: React.CSSProperties = {}
  if (pageData.background?.src) {
    bgStyle.backgroundImage = `url(${pageData.background.src})`
    bgStyle.backgroundSize = 'cover'
    bgStyle.backgroundPosition = 'center'
  }
  
  return (
    <div 
      className={`page-${face} absolute w-full h-full p-6 overflow-hidden bg-white`}
      style={{ backfaceVisibility: 'hidden' }}
    >
      {pageData.background?.src && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            ...bgStyle,
            opacity: pageData.background.opacity || 1
          }}
        />
      )}
      <div 
        className={`page-content relative w-full h-full ${
          isEditMode && isActive ? 'border-2 border-dashed border-green-600' : ''
        }`}
        data-page-index={pageIndex}
      >
        {pageData.elements?.map((element) => (
          element.type === 'text' ? (
            <TextElement
              key={element.id}
              element={element}
              canvas={canvas}
              isEditMode={isEditMode}
              isSelected={false}
              onSelect={() => onSelectElement(element)}
              onUpdate={onUpdateElement}
            />
          ) : (
            <ImageElement
              key={element.id}
              element={element}
              canvas={canvas}
              isEditMode={isEditMode}
              isSelected={false}
              onSelect={() => onSelectElement(element)}
              onUpdate={onUpdateElement}
            />
          )
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
        {pageIndex}
      </div>
    </div>
  )
}

export default Page
