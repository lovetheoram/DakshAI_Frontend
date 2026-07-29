import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { EmotionEngineProvider } from './context/EmotionEngineContext'
import { MindModelProvider } from './context/MindModelContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <EmotionEngineProvider>
          <MindModelProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MindModelProvider>
        </EmotionEngineProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
