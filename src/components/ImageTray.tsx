import React from 'react'

interface ImageTrayProps {
  isVisible: boolean;
  onImageSelect: (imageUrl: string) => void;
}

function ImageTray({ isVisible, onImageSelect }: ImageTrayProps) {
  const imageUrls = [
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/697243/pexels-photo-697243.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=150'
  ]

  const handleDragStart = (e: React.DragEvent, url: string) => {
    e.dataTransfer.setData('text/plain', url)
  }

  const handleClick = (url: string) => {
    onImageSelect(url)
  }

  return (
    <div className={`fixed bottom-[120px] left-1/2 -translate-x-1/2 bg-white rounded-t-xl shadow-lg p-4 flex gap-2 transition-all duration-300 z-50 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
    }`}>
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Image ${index + 1}`}
          className="w-16 h-16 object-cover rounded cursor-move hover:scale-110 transition-transform border-2 border-gray-200"
          draggable
          onDragStart={(e) => handleDragStart(e, url)}
          onClick={() => handleClick(url)}
        />
      ))}
    </div>
  )
}

export default ImageTray
