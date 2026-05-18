// ============================================================
// RegisterForm.jsx — Formulario de registro de nueva cuenta
// ============================================================
// Permite crear una cuenta nueva con email y contraseña.
// Incluye validación en tiempo real de la contraseña (sin
// enviar al servidor) y llama a la API para registrar al usuario.
//
// Props:
//   onSwitch: función de AuthPage para volver al formulario de login
// ============================================================

import { useState } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react' // Iconos de visibilidad y validación
import api from '../api'
import styles from './RegisterForm.module.css'

function RegisterForm({ onSwitch }) {
  const [verPassword, setVerPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // Array de reglas de validación de contraseña.
  // Cada regla tiene un texto descriptivo y una condición booleana
  // que se evalúa en tiempo real a medida que el usuario escribe.
  // React recalcula esto automáticamente cada vez que cambia 'password'.
  const validaciones = [
    { texto: 'Mínimo 6 caracteres',  cumple: password.length >= 6 },
    { texto: 'Una letra mayúscula',  cumple: /[A-Z]/.test(password) },
    { texto: 'Un símbolo especial',  cumple: /[!@#$%^&*+\-_=?]/.test(password) },
  ]

  // true solo cuando TODAS las reglas se cumplen
  const todasCumplen = validaciones.every(v => v.cumple)

  // FUNCIÓN: handleSubmit
  // Llama a la API POST /api/auth/registro con email y contraseña.
  // Si tiene éxito: muestra alerta de confirmación y cambia al formulario de login.
  // Si hay error: muestra el mensaje de error.
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!todasCumplen) return // Bloquea el envío si la contraseña no cumple los requisitos

    setCargando(true)
    setError('')

    try {
      await api.post('/api/auth/registro', { email, password })
      alert('Cuenta creada correctamente, ya puedes iniciar sesión')
      onSwitch() // Vuelve al formulario de login para que el usuario inicie sesión
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Crear cuenta</h2>

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

        {/* Campo de contraseña con ojito */}
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type={verPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className={styles.ojito}
            onClick={() => setVerPassword(!verPassword)}
          >
            {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Lista de validaciones — solo aparece cuando el usuario empieza a escribir */}
        {password.length > 0 && (
          <ul className={styles.validaciones}>
            {validaciones.map((v, i) => (
              // Cada ítem se colorea según si cumple la regla o no
              <li key={i} className={v.cumple ? styles.cumple : styles.noCumple}>
                {v.cumple ? <Check size={13} /> : <X size={13} />} {/* Icono ✓ o ✗ */}
                {v.texto}
              </li>
            ))}
          </ul>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {/* El botón se deshabilita si la contraseña no cumple requisitos o está cargando */}
        <button
          className={styles.boton}
          disabled={!todasCumplen || cargando}
        >
          {cargando ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      {/* Enlace para volver al login */}
      <p className={styles.enlace} onClick={onSwitch}>
        ¿Ya tienes cuenta? <span>Inicia sesión</span>
      </p>
    </div>
  )
}

export default RegisterForm
