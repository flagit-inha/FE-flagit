import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Opening from './pages/startPage/OpeningPage'
import LoginPage from './pages/signupLogin/LoginPage'
import DetailedLocationPage from './pages/homePage/DetailedLocationPage'
import LevelListPage from './pages/myPage/LevelListPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Opening />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/detailed-location" element={<DetailedLocationPage />} />
        <Route path="/level-list" element={<LevelListPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)