import { Type, Image as ImageIcon, Trash2, Save, Plus, ArrowUp, ArrowDown, Upload, X } from 'lucide-react'
import { TextElement, Element, ContentPage } from '../types'

interface ControlBarProps {
  isEditMode: boolean;
  selectedElement: Element | null;
  currentPage: ContentPage;
  onToggleEditMode: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onDeleteElement: () => void;
  onAddPage: () => void;
  onExportJSON: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onUpdateTextProperty: <K extends keyof TextElement>(property: K, value: TextElement[K]) => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onUpdateTextBgColor: (color: string) => void;
  onUpdateTextBgOpacity: (opacity: number) => void;
  onUpdateImageFrame: (frame: string) => void;
  onPageBgUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageBgOpacity: (opacity: number) => void;
  onRemovePageBg: () => void;
}

function ControlBar({
  isEditMode,
  selectedElement,
  currentPage,
  onToggleEditMode,
  onAddText,
  onAddImage,
  onDeleteElement,
  onAddPage,
  onExportJSON,
  onBringForward,
  onSendBackward,
  onUpdateTextProperty,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onUpdateTextBgColor,
  onUpdateTextBgOpacity,
  onUpdateImageFrame,
  onPageBgUpload,
  onPageBgOpacity,
  onRemovePageBg
}: ControlBarProps) {
  const textElement = selectedElement?.type === 'text' ? selectedElement : null
  const imageElement = selectedElement?.type === 'image' ? selectedElement : null

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-[5000] max-h-[50vh] overflow-y-auto">
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
                <button 
                  onClick={onDeleteElement}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              )}
              
              <button 
                onClick={onAddPage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                <Plus size={20} />
                Add Page
              </button>
              
              <div className="flex gap-2 border-l pl-2">
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
              </div>
              
              <div className="flex gap-2 border-l pl-2">
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer" title="Upload Page Background">
                  <Upload size={20} />
                  BG
                  <input type="file" accept="image/*" onChange={onPageBgUpload} className="hidden" />
                </label>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={currentPage.background?.opacity || 1}
                  onChange={(e) => onPageBgOpacity(parseFloat(e.target.value))}
                  className="w-20"
                  title="Background Opacity"
                />
                
                <button 
                  onClick={onRemovePageBg}
                  className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Remove Background"
                >
                  <X size={20} />
                </button>
              </div>
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
            <span className="text-sm font-semibold text-gray-600">Text:</span>
            
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
              onClick={onIncreaseFontSize}
              className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold"
              title="Increase Font Size"
            >
              A+
            </button>
            
            <button
              onClick={onDecreaseFontSize}
              className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold"
              title="Decrease Font Size"
            >
              A-
            </button>
            
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
            
            <input
              type="color"
              value={(() => {
                const bg = textElement.backgroundColor
                const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
                if (match) {
                  return `#${((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1)}`
                }
                return '#e6e6e6'
              })()}
              onChange={(e) => onUpdateTextBgColor(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              title="Text Background Color"
            />
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={(() => {
                const bg = textElement.backgroundColor
                const match = bg.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/)
                return match ? parseFloat(match[1]) : 0.7
              })()}
              onChange={(e) => onUpdateTextBgOpacity(parseFloat(e.target.value))}
              className="w-20"
              title="Text Background Opacity"
            />
          </div>
        )}
        
        {isEditMode && imageElement && (
          <div className="flex flex-wrap gap-2 justify-center items-center border-t pt-3">
            <span className="text-sm font-semibold text-gray-600">Image:</span>
            
            <select
              value={imageElement.imageFrame}
              onChange={(e) => onUpdateImageFrame(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">No Frame</option>
              <option value="simple">Simple Border</option>
              <option value="double">Double Border</option>
              <option value="dashed">Dashed Border</option>
              <option value="rounded">Rounded Frame</option>
              <option value="circle">Circle Frame</option>
              <option value="vintage">Vintage Frame</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

export default ControlBar
