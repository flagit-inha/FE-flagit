import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Opening from './startPage/Opening'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Opening />
  </StrictMode>,
)
