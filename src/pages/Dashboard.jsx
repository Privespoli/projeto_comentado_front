// ============================================================
// Dashboard.jsx — Página principal del usuario logueado
// ============================================================
// Muestra todos los viajes del usuario (como tarjetas) y permite
// crear un nuevo viaje. También tiene header con acceso al perfil
// y botón de cerrar sesión.
//
// RUTA: /dashboard (protegida — solo usuarios logueados)
// ============================================================

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'  // Para obtener datos del usuario
import { useNavigate } from 'react-router-dom'    // Para redirigir a otras páginas
import CrearViajeModal from '../components/CrearViajeModal' // Modal para crear un viaje
import ViajeCard from '../components/ViajeCard'             // Tarjeta de cada viaje
import api from '../api'                          // Para llamar al backend
import styles from './Dashboard.module.css'

function Dashboard() {
  // Obtenemos usuario, perfil y la función de cierre de sesión del contexto global
  const { usuario, perfil, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  // Estado local del componente:
  const [mostrarModal, setMostrarModal] = useState(false) // Si el modal de "Nuevo viaje" está abierto
  const [viajes, setViajes] = useState([])                // Lista de viajes del usuario
  const [cargando, setCargando] = useState(true)          // Indicador de carga inicial

  // FUNCIÓN: cargarViajes
  // Llama a la API GET /api/viajes y guarda la lista en el estado.
  // Se llama al montar el componente y también después de crear un viaje.
  const cargarViajes = async () => {
    try {
      const res = await api.get('/api/viajes')
      setViajes(res.data.viajes)
    } catch (err) {
      console.error('Error al cargar viajes:', err)
    } finally {
      setCargando(false) // Ya terminó de cargar (con éxito o con error)
    }
  }

  // useEffect con []: se ejecuta solo una vez al montar el componente
  useEffect(() => {
    cargarViajes()
  }, [])

  // FUNCIÓN: handleCerrarSesion
  // Cierra la sesión (borra token y usuario del contexto) y redirige al login
  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/')
  }

  // FUNCIÓN: handleViajeCreado
  // Se llama cuando el modal de creación termina con éxito.
  // Cierra el modal y recarga la lista de viajes para mostrar el nuevo.
  const handleViajeCreado = () => {
    setMostrarModal(false)
    cargarViajes()
  }

  return (
    <div className={styles.pagina}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <h1 className={styles.logo}>TravelApp</h1>
        <div className={styles.headerDerecha}>
          {/* Muestra el nombre del perfil si existe, si no muestra el email */}
          <span className={styles.email}>{perfil?.nombre || usuario?.email}</span>
          <button className={styles.btnPerfil} onClick={() => navigate('/perfil')}>
            Mi perfil
          </button>
          <button className={styles.btnCerrarSesion} onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className={styles.contenido}>
        <div className={styles.tituloSeccion}>
          <h2>Mis viajes</h2>
          {/* Abre el modal para crear un nuevo viaje */}
          <button className={styles.btnNuevoViaje} onClick={() => setMostrarModal(true)}>
            + Nuevo viaje
          </button>
        </div>

        {/* Lista de viajes: muestra un mensaje según el estado */}
        <div className={styles.listaViajes}>
          {cargando ? (
            <p className={styles.sinViajes}>Cargando viajes...</p>
          ) : viajes.length === 0 ? (
            <p className={styles.sinViajes}>Todavía no tienes viajes. ¡Crea el primero!</p>
          ) : (
            // Renderiza una ViajeCard por cada viaje.
            // index sirve para asignar colores diferentes a cada tarjeta.
            viajes.map((viaje, idx) => (
              <ViajeCard key={viaje.id} viaje={viaje} usuarioId={usuario?.id} index={idx} />
            ))
          )}
        </div>
      </main>

      {/* ── MODAL "NUEVO VIAJE" ── */}
      {/* Solo se muestra si mostrarModal es true */}
      {mostrarModal && (
        <CrearViajeModal
          onCerrar={() => setMostrarModal(false)}  // Cierra sin crear
          onViajeCreado={handleViajeCreado}         // Cierra y recarga la lista
        />
      )}

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

export default Dashboard
