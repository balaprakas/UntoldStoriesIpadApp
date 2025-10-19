import { Sparkles } from 'lucide-react'

interface TemplateCardProps {
  id: string
  name: string
  description: string
  thumbnailUrl?: string
  onClick: (templateId: string) => void
}

export default function TemplateCard({
  id,
  name,
  description,
  thumbnailUrl,
  onClick
}: TemplateCardProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className="group relative bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left w-full"
    >
      {/* Thumbnail */}
      {thumbnailUrl ? (
        <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
          <img 
            src={thumbnailUrl} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mb-4 flex items-center justify-center">
          <Sparkles size={60} className="text-white opacity-50" />
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-purple-900">{name}</h3>
        <p className="text-purple-700 text-sm line-clamp-2">
          {description}
        </p>
      </div>

      {/* Hover Indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Select →
        </div>
      </div>
    </button>
  )
}
