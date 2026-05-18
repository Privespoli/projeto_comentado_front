// ============================================================
// api.js — Configuración central de peticiones HTTP
// ============================================================
// Este archivo crea una instancia de Axios (librería para hacer
// peticiones HTTP) y define reglas globales que se aplican a
// TODAS las llamadas al servidor backend.
// ============================================================

import axios from 'axios'

// Crea una instancia de Axios apuntando al servidor local.
// En lugar de escribir 'http://localhost:3000' en cada llamada,
// usamos este objeto 'api' y solo ponemos la ruta, ej: api.get('/api/viajes')
const api = axios.create({
  baseURL: 'http://localhost:3000'
})

// INTERCEPTOR DE PETICIÓN (Request Interceptor)
// Se ejecuta ANTES de enviar cualquier petición al servidor.
// Su función: adjuntar el token de autenticación en el header.
// Así el servidor sabe quién eres y si tienes permiso.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // Lee el token guardado en el navegador
  if (token) {
    // Si hay token, lo añade al header Authorization con formato "Bearer <token>"
    config.headers.Authorization = `Bearer ${token}`
  }
  return config // Devuelve la configuración modificada para que Axios la use
})

// INTERCEPTOR DE RESPUESTA (Response Interceptor)
// Se ejecuta cuando el servidor responde.
// - Si la respuesta es correcta: la deja pasar sin cambios.
// - Si hay un error 401 (No Autorizado): borra el token y redirige al login.
api.interceptors.response.use(
  (response) => response, // Respuesta exitosa: pasa directo
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido → limpiamos sesión y mandamos al inicio
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error) // Propaga el error para que el componente lo maneje
  }
)

export default api
