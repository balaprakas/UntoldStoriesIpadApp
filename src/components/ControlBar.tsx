import { Type, Image as ImageIcon, Trash2, Save, Plus, ArrowUp, ArrowDown } from 'lucide-react'
import { TextElement, Element } from '../types'

interface ControlBarProps {
  isEditMode: boolean;
  selectedElement: Element | null;
  onToggleEditMode: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onDeleteElement: () => void;
  onAddPage: () => void;
  onExportJSON: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onUpdateTextProperty: <K extends keyof TextElement>(property: K, value: TextElement[K]) => void;
}

function ControlBar({
  isEditMode,
  selectedElement,
  onToggleEditMode,
  onAddText,
  onAddImage,
  onDeleteElement,
  onAddPage,
  onExportJSON,
  onBringForward,
  onSendBackward,
  onUpdateTextProperty
}: ControlBarProps) {
  const textElement = selectedElement?.type === 'text' ? selectedElement : null

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-[5000]">
      <div className="p-4">
        <div className="flex flex-wrap gap-2 justify-center items-center mb-3">
          <button 
            onClick={onToggleEditMode}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isEditMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isEditMode ? '✅ Finish Edit' : '✍️ Edit Mode'}
          </button>
          
          {isEditMode && (
            <>
              <button 
                onClick={onAddText}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Type size={20} />
                Add Text
              </button>
              
              <button 
                onClick={onAddImage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                <ImageIcon size={20} />
                Add Image
              </button>
              
              {selectedElement && (
                <>
                  <button 
                    onClick={onDeleteElement}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                    Delete
                  </button>
                  
                  <button 
                    onClick={onBringForward}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                    title="Bring Forward"
                  >
                    <ArrowUp size={20} />
                  </button>
                  
                  <button 
                    onClick={onSendBackward}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                    title="Send Backward"
                  >
                    <ArrowDown size={20} />
                  </button>
                </>
              )}
              
              <button 
                onClick={onAddPage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                <Plus size={20} />
                Add Page
              </button>
            </>
          )}
          
          <button 
            onClick={onExportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            <Save size={20} />
            Export
          </button>
        </div>
        
        {isEditMode && textElement && (
          <div className="flex flex-wrap gap-2 justify-center items-center border-t pt-3">
            <select
              value={textElement.fontFamily}
              onChange={(e) => onUpdateTextProperty('fontFamily', e.target.value as any)}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nunito">Nunito</option>
              <option value="playfair">Playfair</option>
              <option value="comic">Comic</option>
              <option value="merriweather">Merriweather</option>
              <option value="opensans">Open Sans</option>
            </select>
            
            <input
              type="color"
              value={textElement.color}
              onChange={(e) => onUpdateTextProperty('color', e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              title="Text Color"
            />
            
            <input
              type="number"
              value={textElement.fontSize}
              onChange={(e) => onUpdateTextProperty('fontSize', parseInt(e.target.value))}
              min="8"
              max="72"
              className="w-20 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              onClick={() => onUpdateTextProperty('fontWeight', textElement.fontWeight === 'bold' ? 'normal' : 'bold')}
              className={`px-4 py-2 rounded font-bold transition-colors ${
                textElement.fontWeight === 'bold'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              B
            </button>
            
            <button
              onClick={() => onUpdateTextProperty('fontStyle', textElement.fontStyle === 'italic' ? 'normal' : 'italic')}
              className={`px-4 py-2 rounded italic transition-colors ${
                textElement.fontStyle === 'italic'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              I
            </button>
            
            <select
              value={textElement.textShape}
              onChange={(e) => onUpdateTextProperty('textShape', e.target.value as any)}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rectangle">Rectangle</option>
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
              <option value="diamond">Diamond</option>
              <option value="hexagon">Hexagon</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

export default ControlBar
