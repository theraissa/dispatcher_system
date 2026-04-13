import { MainRoutes } from './routes/main-routes'
import { AuthProvider } from './auth-context'
import { Toaster } from 'sonner'
import React from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <MainRoutes />
      <Toaster
        position="top-center"
        richColors
        closeButton
      />
    </AuthProvider>
  </React.StrictMode>,
)
