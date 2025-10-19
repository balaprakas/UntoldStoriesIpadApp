import { X, Book, Sparkles } from 'lucide-react'

interface TemplateSelectionModalProps {
  onClose: () => void
  onSelectBlank: () => void
  onSelectTemplate: (templateId: string) => void
}

export default function TemplateSelectionModal({ 
  onClose, 
  onSelectBlank, 
  onSelectTemplate 
}: TemplateSelectionModalProps) {
  const TALE_MAKER_TEMPLATE_ID = 'tale-maker-001'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-8 relative animate-fadeIn shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Create Your Story
          </h2>
          <p className="text-gray-600 text-lg">
            Choose how you'd like to start
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Blank Story Option */}
          <button
            onClick={onSelectBlank}
            className="group relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-8 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Book size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900">Blank Story</h3>
              <p className="text-blue-700">
                Start from scratch with a blank canvas. Perfect for free-form creativity!
              </p>
              <div className="text-sm text-blue-600 font-semibold">
                Free-form • Drag & Drop • Custom Pages
              </div>
            </div>
          </button>

          {/* Template Option */}
          <button
            onClick={() => onSelectTemplate(TALE_MAKER_TEMPLATE_ID)}
            className="group relative bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-200 rounded-xl p-8 hover:border-purple-400 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
              NEW!
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-900">The Tale Maker</h3>
              <p className="text-purple-700">
                Guided storytelling with prompts and structure. Perfect for young writers!
              </p>
              <div className="text-sm text-purple-600 font-semibold">
                Guided Prompts • Story Builder • Image Upload
              </div>
            </div>
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          You can always switch between templates later
        </p>
      </div>
    </div>
  )
}
