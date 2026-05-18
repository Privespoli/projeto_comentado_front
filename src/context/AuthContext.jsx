// ============================================================
// AuthContext.jsx — Contexto global de autenticación
// ============================================================
// Un "contexto" en React es una forma de compartir datos entre
// componentes sin tener que pasar props por cada nivel.
// Este archivo guarda el usuario logueado y su perfil, y
// expone funciones para cargar/cerrar sesión — accesibles
// desde cualquier componente de la app.
// ============================================================

import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

// Crea el "contenedor" del contexto (vacío por ahora)
const AuthContext = createContext()

// COMPONENTE: AuthProvider
// Envuelve toda la app (ver main.jsx) y provee los datos de sesión.
// Cualquier componente dentro puede leer { usuario, perfil, cerrarSesion... }
// usando el hook useAuth() definido al final.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)   // Datos del usuario logueado (email, id...)
  const [perfil, setPerfil] = useState(null)     // Datos de perfil (nombre, foto, teléfono)
  const [cargando, setCargando] = useState(true) // Indica si aún se está comprobando la sesión

  // useEffect con [] se ejecuta UNA SOLA VEZ al montar el componente.
  // Revisa si hay token y usuario guardados en el navegador (localStorage)
  // para restaurar la sesión automáticamente al recargar la página.
  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')

    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado)) // Restaura el usuario desde localStorage
      cargarPerfil()                           // Trae los datos de perfil del servidor
    }

    setCargando(false) // Ya terminó de comprobar → las rutas protegidas pueden decidir
  }, [])

  // FUNCIÓN: cargarPerfil
  // Llama a la API para obtener los datos de perfil (nombre, foto, teléfono).
  // Se guarda en el estado 'perfil' para mostrarlo en el header, perfil, etc.
  const cargarPerfil = async () => {
    try {
      const res = await api.get('/api/perfil')
      if (res.data.perfil) setPerfil(res.data.perfil)
    } catch (err) {
      console.error('Error al cargar perfil:', err)
    }
  }

  // FUNCIÓN: cerrarSesion
  // Borra el token y el usuario del navegador y resetea el estado.
  // Después de esto, las rutas protegidas redirigen al login.
  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
    setPerfil(null)
  }

  // El Provider "inyecta" estos valores en todos sus componentes hijos.
  // Los componentes que llamen a useAuth() recibirán exactamente estos valores.
  return (
    <AuthContext.Provider value={{ usuario, setUsuario, perfil, setPerfil, cargarPerfil, cerrarSesion, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

// HOOK: useAuth
// Atajo para consumir el contexto desde cualquier componente.
// Uso: const { usuario, cerrarSesion } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
