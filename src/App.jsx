// ============================================================
// App.jsx — Enrutador principal de la aplicación
// ============================================================
// Define todas las rutas (páginas) de la app y cuáles necesitan
// que el usuario esté logueado para poder acceder (rutas protegidas).
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'       // Página de login y registro
import Dashboard from './pages/Dashboard'     // Lista de viajes del usuario
import ViajePage from './pages/ViajePage'     // Detalle de un viaje concreto
import PerfilPage from './pages/PerfilPage'   // Perfil del usuario
import MapaPOI from './components/MapaPOI'   // Mapa con puntos de interés

// COMPONENTE: RutaProtegida
// Actúa como "guardia de seguridad": si el usuario no ha iniciado sesión,
// lo redirige automáticamente al inicio ("/"). Si está logueado, muestra
// el contenido (children) normalmente.
function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return null               // Espera a saber si hay sesión antes de decidir
  if (!usuario) return <Navigate to="/" /> // Sin sesión → redirige al login
  return children                          // Con sesión → muestra la página
}

// COMPONENTE PRINCIPAL: App
// Define el mapa de rutas de la aplicación usando React Router.
// BrowserRouter: habilita la navegación por URL (ej: /dashboard, /viaje/3)
// Routes + Route: cada <Route> asocia una URL con un componente de página
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: cualquiera puede ver la página de login/registro */}
        <Route path="/" element={<AuthPage />} />

        {/* Rutas protegidas: solo accesibles si el usuario tiene sesión iniciada */}
        <Route path="/dashboard" element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        } />

        {/* :id es un parámetro dinámico — cambia según el viaje seleccionado */}
        <Route path="/viaje/:id" element={
          <RutaProtegida>
            <ViajePage />
          </RutaProtegida>
        } />

        <Route path="/viaje/:id/mapa" element={
          <RutaProtegida>
            <MapaPOI />
          </RutaProtegida>
        } />

        <Route path="/perfil" element={
          <RutaProtegida>
            <PerfilPage />
          </RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
