import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import { AuthProvider } from './hooks/auth/auth-context'
import "./index.css"
import { MainRoutes } from './routes/main-routes'

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
