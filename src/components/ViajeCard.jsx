// ============================================================
// ViajeCard.jsx — Tarjeta de viaje en el Dashboard
// ============================================================
// Muestra la información resumida de un viaje: imagen, título,
// destino, fechas, estado y rol del usuario.
// Si el usuario es titular, puede cambiar el estado del viaje
// desde un selector desplegable.
//
// Props:
//   viaje: objeto con todos los datos del viaje
//   onActualizado: función opcional llamada al actualizar el estado
//   usuarioId: ID del usuario logueado (para saber si es titular)
//   index: posición en la lista (determina el color de la tarjeta)
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import styles from './ViajeCard.module.css'

// Paleta de colores rotativos para las tarjetas.
// El índice de cada viaje en la lista determina su color (% PALETA.length).
const PALETA = [
  { borda: '#e8624a', bg: '#fff0ee', texto: '#e8624a' },  // coral
  { borda: '#7c5cbf', bg: '#f0eeff', texto: '#7c5cbf' },  // morado
  { borda: '#2EBD8A', bg: '#edfaf4', texto: '#2EBD8A' },  // verde
  { borda: '#F0A020', bg: '#fff8ee', texto: '#F0A020' },  // naranja
]

function ViajeCard({ viaje, onActualizado, usuarioId, index = 0 }) {
  const [estado, setEstado] = useState(viaje.estado) // Estado local (se actualiza al cambiar)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  // Comprueba si el usuario logueado es el titular (creador) del viaje
  const esTitular = viaje.titular_id === usuarioId

  // Color de la tarjeta basado en su posición en la lista
  // El % PALETA.length hace que los colores se repitan ciclicamente
  const cor = PALETA[index % PALETA.length]

  // Traducciones de los estados del viaje (de código a texto legible)
  const estados = {
    planificacion: 'Planificación',
    en_curso: 'En curso',
    finalizado: 'Finalizado'
  }

  // FUNCIÓN: formatearFecha
  // Convierte una fecha ISO (ej: "2026-07-15") al formato legible
  // en español (ej: "15 jul. 2026") usando el objeto nativo Date.
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  // FUNCIÓN: handleEstado
  // Llama a la API PATCH /api/viajes/:id para actualizar el estado del viaje.
  // Solo el titular puede usar este selector (ver el JSX más abajo).
  const handleEstado = async (nuevoEstado) => {
    setCargando(true)
    try {
      await api.patch(`/api/viajes/${viaje.id}`, { estado: nuevoEstado })
      setEstado(nuevoEstado) // Actualiza el estado local para reflejar el cambio visualmente
      if (onActualizado) onActualizado() // Notifica al componente padre si hay callback
    } catch (err) {
      console.error('Error al actualizar estado:', err)
    } finally {
      setCargando(false)
    }
  }

  return (
    // El color del borde de la tarjeta varía según la paleta
    <div
      className={styles.card}
      style={{ borderColor: cor.borda }}
    >
      {/* ── IMAGEN DEL VIAJE ── */}
      <div className={styles.imagen}>
        {viaje.imagen_url
          ? <img src={viaje.imagen_url} alt={viaje.titulo} />
          : <div className={styles.sinImagen}>📍</div> // Placeholder si no hay imagen
        }
        {/* Badge de estado superpuesto sobre la imagen */}
        <span className={`${styles.estado} ${styles[estado]}`}>
          {estados[estado]}
        </span>
      </div>

      {/* ── INFORMACIÓN DEL VIAJE ── */}
      <div className={styles.info}>
        <h3 className={styles.titulo}>{viaje.titulo}</h3>
        <p className={styles.destino}>{viaje.destino}</p>

        {/* Badge "Titular" o "Integrante" con el color de la paleta */}
        <span
          className={styles.badge}
          style={{ background: cor.bg, color: cor.texto }}
        >
          {esTitular ? 'Titular' : 'Integrante'}
        </span>

        {/* Rango de fechas del viaje */}
        <p className={styles.fechas}>
          {formatearFecha(viaje.fecha_inicio)} → {formatearFecha(viaje.fecha_fin)}
        </p>

        {/* Selector de estado — solo visible para el titular del viaje */}
        {esTitular && (
          <select
            className={styles.selectEstado}
            style={{ borderColor: cor.borda }}
            value={estado}
            onChange={e => handleEstado(e.target.value)}
            disabled={cargando}
          >
            <option value="planificacion">Planificación</option>
            <option value="en_curso">En curso</option>
            <option value="finalizado">Finalizado</option>
          </select>
        )}

        {/* Botón para entrar a la página detalle del viaje */}
        <button
          className={styles.btnEntrar}
          style={{
            background: `linear-gradient(135deg, ${cor.borda} 0%, ${cor.borda}cc 100%)`,
            boxShadow: `0 4px 12px ${cor.borda}44`
          }}
          onClick={() => navigate(`/viaje/${viaje.id}`)} // Navega a /viaje/:id
        >
          Entrar al viaje
        </button>
      </div>
    </div>
  )
}

export default ViajeCard
