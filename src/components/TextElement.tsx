import { useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import { TextElement as TextElementType, CanvasSize } from '../types'

interface TextElementProps {
  element: TextElementType;
  canvas: CanvasSize;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (element: TextElementType) => void;
}

function TextElement({ element, canvas, isEditMode, isSelected, onSelect, onUpdate }: TextElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  
  const percentToPixels = (percent: number, dimension: 'width' | 'height') => {
    const base = dimension === 'width' ? canvas.width : canvas.height
    return (percent / 100) * base
  }
  
  const pixelsToPercent = (pixels: number, dimension: 'width' | 'height') => {
    const base = dimension === 'width' ? canvas.width : canvas.height
    return (pixels / base) * 100
  }
  
  const handleDragStop = (_e: any, data: any) => {
    onUpdate({
      ...element,
      x: pixelsToPercent(data.x, 'width'),
      y: pixelsToPercent(data.y, 'height')
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
  
  const xPixels = percentToPixels(element.x, 'width')
  const yPixels = percentToPixels(element.y, 'height')
  const widthPixels = percentToPixels(element.width, 'width')
  const heightPixels = percentToPixels(element.height, 'height')
  const fontSizePixels = percentToPixels(element.fontSize, 'width')
  
  return (
    <Draggable
      disabled={!isEditMode}
      position={{ x: xPixels, y: yPixels }}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={elementRef}
        className={`editable text-box absolute ${fontFamilyClass} ${shapeClass} ${
          isSelected && isEditMode ? 'selected ring-2 ring-green-600 ring-offset-2' : ''
        } ${isEditMode ? 'cursor-move' : 'cursor-default'}`}
        style={{
          width: `${widthPixels}px`,
          height: `${heightPixels}px`,
          transform: `rotate(${element.rotation}deg)`,
          zIndex: element.zIndex,
          fontWeight: element.fontWeight,
          fontStyle: element.fontStyle,
          backgroundColor: element.backgroundColor,
          color: element.color,
          fontSize: `${fontSizePixels}px`,
          padding: '10px',
          lineHeight: '1.4',
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
