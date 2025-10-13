import './App.css'

function App() {
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
              Aloha! Selamat datang di Kids Land!
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Mari belajar dengan karakter-karakter lucu yang siap menemanimu
              berpetualang di dunia pengetahuan untuk anak usia 7-14 tahun
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <button className="w-full max-w-md bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all shadow-lg">
              Daftar Sekarang
            </button>
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <a href="#" className="text-purple-600 font-semibold hover:text-purple-700">
                Masuk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
