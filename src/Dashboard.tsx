import { Play, Lock, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import storiesData from './stories.json'

function Dashboard() {
  const { stories } = storiesData
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-amber-50 p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Halo Budi Jailani!
            </h1>
            <p className="text-lg text-gray-600">
              Ayo belajar bersama Kids Land
            </p>
          </div>
          <button 
            onClick={() => navigate('/create-story')}
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-full p-4 shadow-lg transition-all"
          >
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className={`bg-gradient-to-br ${story.gradient} rounded-3xl p-6 shadow-lg relative overflow-hidden ${
                index === stories.length - 1 && stories.length % 2 !== 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {story.title}
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  {story.locked ? (
                    <span className="bg-white/30 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Lock size={14} />
                      Segera dimulai
                    </span>
                  ) : (
                    <span className="bg-white/30 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Level {story.level}
                    </span>
                  )}
                </div>
                <button
                  className={`${
                    story.locked
                      ? 'bg-white/50 cursor-not-allowed opacity-75'
                      : 'bg-white/90 hover:bg-white'
                  } text-${story.locked ? 'blue' : 'purple'}-600 rounded-full p-3 transition-all shadow-md`}
                  disabled={story.locked}
                >
                  {story.locked ? <Lock size={24} /> : <Play size={24} fill="currentColor" />}
                </button>
              </div>
              <div className="absolute bottom-0 right-0 text-white/20 text-6xl">
                {story.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
