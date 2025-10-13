import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './Welcome'
import Dashboard from './Dashboard'
import CreateStory from './CreateStory'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-story" element={<CreateStory />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
