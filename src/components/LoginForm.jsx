// ============================================================
// LoginForm.jsx — Formulario de inicio de sesión
// ============================================================
// Permite a un usuario existente iniciar sesión con email y
// contraseña. Al hacer login exitoso, guarda el token en
// localStorage y redirige al dashboard.
//
// Props:
//   onSwitch: función que llama AuthPage para cambiar al formulario
//             de registro cuando el usuario hace clic en "Regístrate"
// ============================================================

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'  // Iconos del ojito para mostrar/ocultar contraseña
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import styles from './LoginForm.module.css'

function LoginForm({ onSwitch }) {
  // Estado del formulario
  const [verPassword, setVerPassword] = useState(false) // Alterna entre mostrar/ocultar contraseña
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')       // Mensaje de error a mostrar
  const [cargando, setCargando] = useState(false) // Deshabilita el botón mientras espera respuesta

  const { setUsuario } = useAuth() // Para guardar el usuario en el contexto global tras el login
  const navigate = useNavigate()

  // FUNCIÓN: handleSubmit
  // Se ejecuta al enviar el formulario.
  // Llama a la API POST /api/auth/login con email y contraseña.
  // Si el servidor responde con éxito:
  //   - Guarda el token de sesión en localStorage (persiste al cerrar pestaña)
  //   - Guarda el usuario en localStorage
  //   - Actualiza el contexto global con setUsuario
  //   - Redirige al dashboard
  // Si hay error: muestra el mensaje de error debajo del formulario.
  const handleSubmit = async (e) => {
    e.preventDefault()      // Evita que el formulario recargue la página
    setCargando(true)
    setError('')

    try {
      const res = await api.post('/api/auth/login', { email, password })
      // Guardamos el token (JWT) para enviarlo en futuras peticiones (ver api.js)
      localStorage.setItem('token', res.data.session.access_token)
      // Guardamos los datos del usuario para restaurar la sesión al recargar
      localStorage.setItem('usuario', JSON.stringify(res.data.user))
      setUsuario(res.data.user) // Actualiza el contexto → AuthContext lo distribuye a toda la app
      navigate('/dashboard')    // Redirige a la página principal
    } catch (err) {
      setError(err.response?.data?.error || 'Email o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Iniciar sesión</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Campo de email */}
        <input
          className={styles.input}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Campo de contraseña con botón para mostrar/ocultar */}
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type={verPassword ? 'text' : 'password'} // 'text' muestra el texto, 'password' lo oculta
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Botón ojito: alterna entre Eye (oculto) y EyeOff (visible) */}
          <button
            type="button"
            className={styles.ojito}
            onClick={() => setVerPassword(!verPassword)}
          >
            {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <p className={styles.olvidaste}>¿Olvidaste tu contraseña?</p>

        {/* Mensaje de error (solo aparece si hay error) */}
        {error && <p className={styles.error}>{error}</p>}

        {/* El botón se deshabilita mientras se espera respuesta del servidor */}
        <button className={styles.boton} disabled={cargando}>
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Enlace para cambiar al formulario de registro */}
      <p className={styles.enlace} onClick={onSwitch}>
        ¿No tienes cuenta? <span>Regístrate</span>
      </p>
    </div>
  )
}

export default LoginForm
