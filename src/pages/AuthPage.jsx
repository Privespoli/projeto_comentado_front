// ============================================================
// AuthPage.jsx — Página de inicio (Login / Registro)
// ============================================================
// Esta es la página pública (ruta "/") que ven los usuarios
// que aún no han iniciado sesión. Contiene:
//   - Un navbar con enlaces
//   - Un hero con slideshow de imágenes de fondo
//   - Un formulario de login o registro (alternables)
//   - Sección "Sobre nosotros" con features
//   - Formulario de contacto
//   - Footer
// ============================================================

import { useState, useEffect } from 'react'
import LoginForm from '../components/LoginForm'       // Formulario de inicio de sesión
import RegisterForm from '../components/RegisterForm' // Formulario de registro
import ContactForm from '../components/ContactForm'   // Formulario de contacto (EmailJS)
import styles from './AuthPage.module.css'

// Array de slides para el carrusel de fondo del hero.
// Cada slide tiene una URL de imagen (Unsplash) y un texto descriptivo.
const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80',
    caption: 'Explora el mundo juntos'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
    caption: 'Playas que te dejarán sin aliento'
  },
  {
    url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1600&q=80',
    caption: 'Aventuras que recordarás siempre'
  },
  {
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80',
    caption: 'Viaja en grupo, crea memorias'
  },
]

function AuthPage() {
  // true = muestra LoginForm | false = muestra RegisterForm
  const [mostrarLogin, setMostrarLogin] = useState(true)
  // Índice del slide actual del carrusel (0 al 3)
  const [slideActual, setSlideActual] = useState(0)

  // useEffect: cuando el componente se monta, inicia un temporizador
  // que cambia el slide cada 4.5 segundos automáticamente.
  // El "return () => clearInterval(timer)" limpia el temporizador
  // cuando el componente se desmonta (evita memory leaks).
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideActual(prev => (prev + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.pagina}>

      {/* ── NAVBAR ── */}
      <nav className={styles.navbar}>
        <span className={styles.navLogo}>✈ TravelApp</span>
        <div className={styles.navLinks}>
          {/* Los href "#id" hacen scroll suave a la sección con ese id */}
          <a href="#sobre-nosotros" className={styles.navLink}>Sobre nosotros</a>
          <a href="#contacto" className={styles.navLink}>Contacto</a>
        </div>
      </nav>

      {/* ── HERO con carrusel de imágenes ── */}
      <section className={styles.hero}>
        {/* Renderiza todos los slides; solo el activo tiene la clase slideActivo */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`${styles.slide} ${i === slideActual ? styles.slideActivo : ''}`}
            style={{ backgroundImage: `url(${slide.url})` }}
          />
        ))}
        {/* Capa oscura semitransparente encima de la imagen */}
        <div className={styles.overlay} />

        {/* Texto descriptivo del slide actual */}
        <p className={styles.slideCaption}>{SLIDES[slideActual].caption}</p>

        {/* Puntos de navegación del carrusel (uno por slide) */}
        <div className={styles.slideDots}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === slideActual ? styles.dotActivo : ''}`}
              onClick={() => setSlideActual(i)} // Permite saltar a un slide al hacer clic
            />
          ))}
        </div>

        {/* Tarjeta flotante con el formulario de Login o Registro */}
        <div className={styles.loginCard}>
          {mostrarLogin
            ? <LoginForm onSwitch={() => setMostrarLogin(false)} />   // Al registrarse → muestra RegisterForm
            : <RegisterForm onSwitch={() => setMostrarLogin(true)} /> // Al volver → muestra LoginForm
          }
        </div>
      </section>

      {/* ── SECCIÓN "SOBRE NOSOTROS" ── */}
      {/* id="sobre-nosotros" permite que el link del navbar haga scroll aquí */}
      <section id="sobre-nosotros" className={styles.sobreNosotros}>
        <div className={styles.sobreContenido}>
          <span className={styles.badge}>¿Qué es TravelApp?</span>
          <h2 className={styles.sobreTitulo}>Organiza tu viaje en grupo,<br/>sin el caos</h2>
          <p className={styles.sobreTexto}>
            TravelApp es la plataforma para organizar viajes en grupo de forma sencilla y sin estrés.
            Coordina itinerarios, comparte documentos, sugiere puntos de interés y vota con tu grupo —
            todo en un mismo lugar.
          </p>
          {/* Grid de 4 características principales de la app */}
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIconWrap} style={{background:'#fff0ee'}}>
                <span className={styles.featureIcon}>🗓️</span>
              </div>
              <h3>Itinerario compartido</h3>
              <p>Planifica cada día del viaje con tu grupo en tiempo real.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrap} style={{background:'#f0eeff'}}>
                <span className={styles.featureIcon}>📎</span>
              </div>
              <h3>Tickets y documentos</h3>
              <p>Centraliza vuelos, hoteles y reservas en un solo lugar.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrap} style={{background:'#e8f8f2'}}>
                <span className={styles.featureIcon}>📍</span>
              </div>
              <h3>Puntos de interés</h3>
              <p>Sugiere lugares y vota con tu grupo los favoritos.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrap} style={{background:'#fff5e8'}}>
                <span className={styles.featureIcon}>👥</span>
              </div>
              <h3>Gestión de grupo</h3>
              <p>Invita a tus compañeros y organízate fácilmente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN DE CONTACTO ── */}
      <section id="contacto" className={styles.contactoSeccion}>
        <ContactForm />
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerContenido}>
          <div className={styles.footerLogo}>✈ TravelApp</div>
          <div className={styles.footerLinks}>
            <a href="#sobre-nosotros" className={styles.footerLink}>Sobre nosotros</a>
            <a href="#contacto" className={styles.footerLink}>Contacto</a>
            <span className={styles.footerLink}>Condiciones de uso</span>
            <span className={styles.footerLink}>Privacidad</span>
          </div>
          <p className={styles.footerCopy}>© 2026 Priscila & Melina. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  )
}

export default AuthPage
