// ============================================================
// PerfilPage.jsx — Página de perfil del usuario
// ============================================================
// Página contenedora que muestra el componente <Perfil />.
// Incluye header con navegación y botón de cerrar sesión.
//
// RUTA: /perfil (protegida)
// ============================================================

import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Perfil from '../components/Perfil'   // Componente con el formulario de perfil
import styles from './PerfilPage.module.css'

function PerfilPage() {
  // Obtenemos el usuario logueado y la función de cerrar sesión del contexto global
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  // FUNCIÓN: handleCerrarSesion
  // Cierra la sesión y redirige al login
  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/')
  }

  return (
    <div className={styles.pagina}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <span className={styles.logo}>✈ TravelApp</span>
        <div className={styles.headerDerecha}>
          {/* Botón para volver al dashboard sin cerrar sesión */}
          <button className={styles.btnVolver} onClick={() => navigate('/dashboard')}>
            ← Volver
          </button>
          <button className={styles.btnCerrarSesion} onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* ── CONTENIDO: componente Perfil ── */}
      {/* Pasamos el objeto usuario como prop para mostrar el email (campo no editable) */}
      <main className={styles.contenido}>
        <Perfil usuario={usuario} />
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

export default PerfilPage
