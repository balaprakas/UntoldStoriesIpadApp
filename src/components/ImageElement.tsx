import Draggable from 'react-draggable'
import { ImageElement as ImageElementType, CanvasSize } from '../types'

interface ImageElementProps {
  element: ImageElementType;
  canvas: CanvasSize;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (element: ImageElementType) => void;
}

function ImageElement({ element, canvas, isEditMode, isSelected, onSelect, onUpdate }: ImageElementProps) {
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
  
  const frameClass = `image-frame-${element.imageFrame}`
  
  const xPixels = percentToPixels(element.x, 'width')
  const yPixels = percentToPixels(element.y, 'height')
  const widthPixels = percentToPixels(element.width, 'width')
  const heightPixels = percentToPixels(element.height, 'height')
  
  return (
    <Draggable
      disabled={!isEditMode}
      position={{ x: xPixels, y: yPixels }}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        className={`editable absolute ${frameClass} ${
          isSelected && isEditMode ? 'selected ring-2 ring-green-600 ring-offset-2' : ''
        } ${isEditMode ? 'cursor-move' : 'cursor-default'}`}
        style={{
          width: `${widthPixels}px`,
          height: `${heightPixels}px`,
          transform: `rotate(${element.rotation}deg)`,
          zIndex: element.zIndex,
          touchAction: 'none'
        }}
        onClick={handleSelect}
        data-id={element.id}
      >
        <img
          src={element.src}
          alt="Story element"
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    </Draggable>
  )
}

export default ImageElement
