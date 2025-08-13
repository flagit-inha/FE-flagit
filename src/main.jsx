import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OpeningPage from './pages/startPage/OpeningPage'
import LandingPage from './pages/startPage/LandingPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OpeningPage/>
  </StrictMode>,
)