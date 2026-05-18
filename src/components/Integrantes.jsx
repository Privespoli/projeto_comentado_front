// ============================================================
// Integrantes.jsx — Gestión de miembros del viaje
// ============================================================
// Muestra la lista de integrantes del viaje y, si el usuario
// es el titular, permite añadir nuevos miembros por email
// o eliminar los existentes.
//
// Props:
//   viajeId: ID del viaje (para las llamadas a la API)
//   esTitular: booleano — si el usuario es el creador del viaje
// ============================================================

import { useState, useEffect } from 'react'
import api from '../api'
import styles from './Integrantes.module.css'

function Integrantes({ viajeId, esTitular }) {
  const [integrantes, setIntegrantes] = useState([]) // Lista de integrantes del viaje
  const [email, setEmail] = useState('')             // Email para añadir un nuevo integrante
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  // FUNCIÓN: cargarIntegrantes
  // Llama a GET /api/viajes/:id/integrantes para obtener la lista actualizada.
  // Se llama al montar el componente y tras añadir/eliminar un integrante.
  const cargarIntegrantes = async () => {
    try {
      const res = await api.get(`/api/viajes/${viajeId}/integrantes`)
      setIntegrantes(res.data.integrantes)
    } catch (err) {
      console.error('Error al cargar integrantes:', err)
    }
  }

  // Carga los integrantes cuando el componente se monta o cambia el viajeId
  useEffect(() => { cargarIntegrantes() }, [viajeId])

  // FUNCIÓN: handleAgregar
  // Llama a POST /api/viajes/:id/integrantes con el email del nuevo miembro.
  // El backend busca al usuario por email y lo añade al viaje.
  const handleAgregar = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await api.post(`/api/viajes/${viajeId}/integrantes`, { email })
      setEmail('')            // Limpia el campo
      cargarIntegrantes()    // Recarga la lista para mostrar el nuevo integrante
    } catch (err) {
      setError(err.response?.data?.error || 'Error al añadir integrante')
    } finally {
      setCargando(false)
    }
  }

  // FUNCIÓN: handleEliminar
  // Llama a DELETE /api/viajes/:viajeId/integrantes/:integranteId para quitar al miembro.
  const handleEliminar = async (integranteId) => {
    try {
      await api.delete(`/api/viajes/${viajeId}/integrantes/${integranteId}`)
      cargarIntegrantes() // Recarga la lista después de eliminar
    } catch (err) {
      console.error('Error al eliminar integrante:', err)
    }
  }

  // FUNCIÓN: getIniciales
  // Genera la inicial del avatar a partir del nombre o email del integrante.
  // Si tiene nombre → primera letra del nombre
  // Si no → primera letra del email
  // Si no hay nada → '?'
  const getIniciales = (nombre, email) => {
    if (nombre) return nombre.charAt(0).toUpperCase()
    if (email) return email.charAt(0).toUpperCase()
    return '?'
  }

  // Array de colores para los avatares
  const colores = ['#e8624a', '#7c5cbf', '#2EBD8A', '#F0A020', '#A8CECA']

  // FUNCIÓN: getColor
  // Asigna un color al avatar de forma determinista (siempre el mismo para el mismo nombre/email)
  // usando el código ASCII del primer carácter y el módulo del array de colores.
  const getColor = (str) => colores[(str?.charCodeAt(0) || 0) % colores.length]

  return (
    <div className={styles.contenedor}>
      <h3 className={styles.titulo}>Integrantes del viaje</h3>

      {/* Formulario para añadir integrante — solo visible para el titular */}
      {esTitular && (
        <form onSubmit={handleAgregar} className={styles.form}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email del integrante"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button className={styles.btnAgregar} disabled={cargando}>
            {cargando ? 'Añadiendo...' : '+ Añadir'}
          </button>
        </form>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {/* Grid de tarjetas de integrantes */}
      <div className={styles.grid}>
        {integrantes.map(i => (
          <div key={i.id} className={styles.card}>
            {/* Avatar con inicial y color */}
            <div
              className={styles.avatar}
              style={{ background: getColor(i.nombre || i.email) }}
            >
              {getIniciales(i.nombre, i.email)}
            </div>

            {/* Nombre (o email si no tiene nombre) */}
            <p className={styles.nombre}>{i.nombre || i.email}</p>

            {/* Email debajo del nombre (solo si tiene nombre) */}
            {i.nombre && (
              <p className={styles.emailText}>{i.email}</p>
            )}

            {/* Rol: 'titular' o 'integrante' */}
            <span className={`${styles.rol} ${styles[i.rol]}`}>{i.rol}</span>

            {/* Botón eliminar — solo para el titular y solo en integrantes (no en el titular) */}
            {esTitular && i.rol !== 'titular' && (
              <button
                className={styles.btnEliminar}
                onClick={() => handleEliminar(i.id)}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      {integrantes.length === 0 && (
        <p className={styles.sinIntegrantes}>No hay integrantes todavía</p>
      )}
    </div>
  )
}

export default Integrantes
