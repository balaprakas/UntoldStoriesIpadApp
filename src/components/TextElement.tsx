import { useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import { TextElement as TextElementType } from '../types'

interface TextElementProps {
  element: TextElementType;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (element: TextElementType) => void;
}

function TextElement({ element, isEditMode, isSelected, onSelect, onUpdate }: TextElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  
  const handleDragStop = (_e: any, data: any) => {
    onUpdate({
      ...element,
      x: data.x,
      y: data.y
    })
  }
  
  const handleSelect = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation()
      onSelect()
    }
  }
  
  const handleContentChange = () => {
    if (elementRef.current && isEditMode) {
      onUpdate({
        ...element,
        content: elementRef.current.innerHTML
      })
    }
  }
  
  useEffect(() => {
    if (elementRef.current && isSelected && isEditMode) {
      elementRef.current.focus()
    }
  }, [isSelected, isEditMode])
  
  const fontFamilyClass = `font-${element.fontFamily}`
  const shapeClass = `text-shape-${element.textShape}`
  
  return (
    <Draggable
      disabled={!isEditMode}
      position={{ x: element.x, y: element.y }}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={elementRef}
        className={`editable text-box absolute ${fontFamilyClass} ${shapeClass} ${
          isSelected && isEditMode ? 'selected ring-2 ring-green-600 ring-offset-2' : ''
        } ${isEditMode ? 'cursor-move' : 'cursor-default'}`}
        style={{
          width: element.width,
          height: element.height,
          transform: `rotate(${element.rotation}deg)`,
          zIndex: element.zIndex,
          fontWeight: element.fontWeight,
          fontStyle: element.fontStyle,
          backgroundColor: element.backgroundColor,
          color: element.color,
          fontSize: `${element.fontSize}px`,
          padding: '10px',
          lineHeight: '1.4',
          minWidth: '50px',
          minHeight: '30px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          touchAction: 'none'
        }}
        contentEditable={isEditMode && isSelected}
        suppressContentEditableWarning
        onClick={handleSelect}
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: element.content }}
        data-id={element.id}
      />
    </Draggable>
  )
}

export default TextElement
