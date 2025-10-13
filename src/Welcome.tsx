import { useNavigate } from 'react-router-dom'

function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <div className="flex justify-center gap-4 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <div className="text-white text-5xl">👾</div>
            </div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
              <div className="text-white text-5xl">🦄</div>
            </div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <div className="text-white text-5xl">🦊</div>
            </div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <div className="text-white text-5xl">⭐</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Untold Stories!
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              "Every child's imagination deserves a stage."
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full max-w-md bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all shadow-lg"
            >
              Login
            </button>
            <p className="text-gray-600">
              New User?
              <a href="#" className="text-purple-600 font-semibold hover:text-purple-700">
                 Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
