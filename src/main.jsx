import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { EmotionEngineProvider } from './context/EmotionEngineContext'
import { MindModelProvider } from './context/MindModelContext'
import { ExperienceProvider } from './context/ExperienceContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <EmotionEngineProvider>
            <MindModelProvider>
              <ExperienceProvider>
                <App />
              </ExperienceProvider>
            </MindModelProvider>
          </EmotionEngineProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
