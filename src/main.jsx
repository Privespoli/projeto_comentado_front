// ============================================================
// main.jsx — Punto de entrada de la aplicación
// ============================================================
// Este es el primer archivo que se ejecuta cuando la app arranca.
// Su función: montar (renderizar) el componente raíz <App />
// dentro del elemento HTML con id="root" (en index.html).
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext' // Proveedor de autenticación global
import './index.css'  // Estilos globales de la app
import App from './App.jsx' // Componente principal con las rutas

// createRoot: monta React en el elemento HTML con id "root"
// StrictMode: modo de desarrollo que detecta problemas potenciales (no afecta producción)
// AuthProvider: envuelve toda la app para que cualquier componente pueda acceder
//               al usuario logueado, sin tener que pasar props manualmente
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
