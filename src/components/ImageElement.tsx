import Draggable from 'react-draggable'
import { ImageElement as ImageElementType } from '../types'

interface ImageElementProps {
  element: ImageElementType;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (element: ImageElementType) => void;
}

function ImageElement({ element, isEditMode, isSelected, onSelect, onUpdate }: ImageElementProps) {
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
  
  const frameClass = `image-frame-${element.imageFrame}`
  
  return (
    <Draggable
      disabled={!isEditMode}
      position={{ x: element.x, y: element.y }}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        className={`editable absolute ${frameClass} ${
          isSelected && isEditMode ? 'selected ring-2 ring-green-600 ring-offset-2' : ''
        } ${isEditMode ? 'cursor-move' : 'cursor-default'}`}
        style={{
          width: element.width,
          height: element.height,
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
