import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './Welcome'
import Dashboard from './Dashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
