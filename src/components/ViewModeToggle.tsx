import { Book, Edit3 } from 'lucide-react'

interface ViewModeToggleProps {
  viewMode: 'single' | 'two'
  onToggle: () => void
  className?: string
}

export default function ViewModeToggle({ viewMode, onToggle, className = '' }: ViewModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
      title={viewMode === 'single' ? 'Switch to Two Page View (Reading Mode)' : 'Switch to Single Page View (Edit Mode)'}
    >
      {viewMode === 'single' ? (
        <>
          <Book size={20} className="text-purple-600" />
          <span className="font-semibold text-gray-700">📖 View Mode</span>
        </>
      ) : (
        <>
          <Edit3 size={20} className="text-blue-600" />
          <span className="font-semibold text-gray-700">✏️ Edit Mode</span>
        </>
      )}
    </button>
  )
}
