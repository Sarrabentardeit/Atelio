import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import VitrinePage from './VitrinePage'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VitrinePage />
  </StrictMode>
)
