import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Opening from './pages/startPage/OpeningPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Opening />
  </StrictMode>,
)