import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className="flex justify-center items-center min-h-screen">
        <App />
      </div>
    </StrictMode>
)
