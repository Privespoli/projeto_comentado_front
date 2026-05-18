// ============================================================
// ViajePage.jsx — Página de detalle de un viaje
// ============================================================
// Muestra el contenido de un viaje específico, organizado en
// 4 secciones navegables mediante un menú de pestañas:
//   - Integrantes: miembros del grupo
//   - Tickets & Docs: documentos y tickets del viaje
//   - Itinerario: eventos organizados por días
//   - Mapa & POI: puntos de interés con votación
//
// RUTA: /viaje/:id (protegida)
// El :id es dinámico — cambia según el viaje elegido.
// ============================================================

import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Integrantes from '../components/Integrantes'     // Sección de miembros del viaje
import Itinerario from '../components/Itinerario'       // Sección de itinerario
import MapaPOI from '../components/MapaPOI'             // Sección de mapa y POI
import TicketsYDocs from '../components/TicketsYDocs'   // Sección de documentos
import api from '../api'
import styles from './ViajePage.module.css'

// Definición de las secciones del menú de pestañas.
// Cada sección tiene un id (para identificarla), etiqueta y color propio.
const SECCIONES = [
  { id: 'integrantes', label: 'Integrantes',    color: '#e8624a' },
  { id: 'documentos',  label: 'Tickets & Docs', color: '#2EBD8A' },
  { id: 'itinerario',  label: 'Itinerario',     color: '#F0A020' },
  { id: 'mapa',        label: 'Mapa & POI',     color: '#7c5cbf' },
]

function ViajePage() {
  // useParams: extrae el :id de la URL (ej: /viaje/3 → id = "3")
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  // Sección activa del menú (por defecto muestra Integrantes)
  const [seccionActiva, setSeccionActiva] = useState('integrantes')
  // Datos completos del viaje (traídos de la API)
  const [viaje, setViaje] = useState(null)

  // Al montar o cuando cambia el id: carga los datos del viaje
  useEffect(() => {
    const cargarViaje = async () => {
      try {
        const res = await api.get(`/api/viajes/${id}`) // GET /api/viajes/:id
        setViaje(res.data.viaje)
      } catch (err) {
        console.error('Error al cargar viaje:', err)
      }
    }
    cargarViaje()
  }, [id]) // Se re-ejecuta si el id cambia

  // Determina si el usuario actual es el titular (creador) del viaje.
  // Esto controla si puede editar integrantes, documentos, itinerario, etc.
  const esTitular = viaje?.titular_id === usuario?.id

  // Color del borde/acento de la sección activa (para estilos dinámicos)
  const colorActivo = SECCIONES.find(s => s.id === seccionActiva)?.color || '#e8624a'

  return (
    <div className={styles.pagina}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        {/* Botón para volver al dashboard */}
        <button className={styles.btnVolver} onClick={() => navigate('/dashboard')}>
          ← Volver
        </button>
        {/* Título del viaje (mientras carga muestra "Mi viaje") */}
        <h1 className={styles.titulo}>{viaje?.titulo || 'Mi viaje'}</h1>
      </header>

      {/* ── MENÚ DE PESTAÑAS ── */}
      {/* Cada botón cambia la seccionActiva, lo que controla qué componente se muestra */}
      <nav className={styles.menu}>
        {SECCIONES.map(s => (
          <button
            key={s.id}
            className={`${styles.menuBtn} ${seccionActiva === s.id ? styles.activo : ''}`}
            // La pestaña activa recibe fondo de color + texto blanco
            style={seccionActiva === s.id ? {
              color: 'white',
              background: s.color,
              borderBottomColor: 'transparent',
              borderRadius: '8px 8px 0 0',
            } : {}}
            onClick={() => setSeccionActiva(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* ── CONTENIDO DE LA SECCIÓN ACTIVA ── */}
      {/* Solo renderiza el componente de la sección que está seleccionada */}
      <main className={styles.contenido}>
        {seccionActiva === 'integrantes' && (
          <Integrantes viajeId={id} esTitular={esTitular} />
        )}
        {seccionActiva === 'documentos' && (
          <TicketsYDocs viajeId={id} esTitular={esTitular} />
        )}
        {seccionActiva === 'itinerario' && (
          // esAdmin controla si puede añadir/eliminar eventos del itinerario
          <Itinerario viaje={viaje} esAdmin={esTitular} />
        )}
        {seccionActiva === 'mapa' && (
          <MapaPOI viajeId={id} esAdmin={esTitular} />
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerContenido}>
          <div className={styles.footerLogo}>✈ TravelApp</div>
          <div className={styles.footerLinks}>
            <span className={styles.footerLink}>Sobre nosotros</span>
            <span className={styles.footerLink}>Contacto</span>
            <span className={styles.footerLink}>Condiciones de uso</span>
            <span className={styles.footerLink}>Privacidad</span>
          </div>
          <p className={styles.footerCopy}>© 2026 Priscila & Melina. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  )
}

export default ViajePage
