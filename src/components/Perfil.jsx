// ============================================================
// Perfil.jsx — Componente de edición del perfil de usuario
// ============================================================
// Permite al usuario ver y editar su nombre, teléfono y foto
// de perfil. El email no es editable (está ligado a la cuenta).
//
// Al guardar:
//   1. Sube los datos al servidor (POST /api/perfil con FormData)
//   2. Llama a cargarPerfil() del contexto para actualizar
//      el nombre en el header del Dashboard
//   3. Muestra un mensaje de confirmación durante 3 segundos
//
// Props:
//   usuario: objeto del usuario logueado (para mostrar el email)
// ============================================================

import { useState, useEffect, useRef } from 'react'
import api from '../api'
import styles from './Perfil.module.css'
import { useAuth } from '../context/AuthContext'

function Perfil({ usuario }) {
  // cargarPerfil del contexto global — actualiza el nombre en el header tras guardar
  const { cargarPerfil } = useAuth()

  // Estado del formulario
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [foto, setFoto] = useState(null)           // Archivo de imagen nuevo (si el usuario cambia la foto)
  const [fotoPreview, setFotoPreview] = useState(null) // URL para previsualizar la foto

  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)     // Mensaje de éxito o error

  // Referencia al input de archivo oculto de la foto
  const fotoRef = useRef(null)

  // useEffect: carga los datos actuales del perfil al montar el componente.
  // Llama a GET /api/perfil y rellena los campos del formulario con los datos existentes.
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await api.get('/api/perfil')
        if (res.data.perfil) {
          setNombre(res.data.perfil.nombre || '')
          setTelefono(res.data.perfil.telefono || '')
          setFotoPreview(res.data.perfil.foto_url || null) // URL de la foto guardada en el servidor
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err)
      }
    }
    cargarPerfil()
  }, [])

  // FUNCIÓN: handleFoto
  // Se ejecuta cuando el usuario selecciona una nueva foto.
  // Guarda el archivo y crea una URL temporal para el preview.
  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFoto(file)
      setFotoPreview(URL.createObjectURL(file)) // URL temporal para previsualizar sin subir
    }
  }

  // FUNCIÓN: handleGuardar
  // Envía el formulario al servidor con FormData (necesario para incluir la foto).
  // Después actualiza el contexto global (para el nombre en el header) y
  // muestra un mensaje de confirmación que desaparece a los 3 segundos.
  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    try {
      const formData = new FormData()
      formData.append('nombre', nombre)
      formData.append('telefono', telefono)
      if (foto) formData.append('foto', foto) // Solo incluye foto si el usuario eligió una nueva

      // POST /api/perfil — crea o actualiza el perfil del usuario
      await api.post('/api/perfil', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setMensaje('Perfil guardado correctamente')
      cargarPerfil() // Actualiza el contexto global → el nombre se actualiza en el header
      setTimeout(() => setMensaje(null), 3000) // Oculta el mensaje tras 3 segundos
    } catch (err) {
      setMensaje('Error al guardar el perfil')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Mi perfil</h2>

      {/* ── AVATAR / FOTO DE PERFIL ── */}
      {/* Al hacer clic en el avatar, activa el input file oculto */}
      <div className={styles.avatar} onClick={() => fotoRef.current.click()}>
        {fotoPreview
          ? <img src={fotoPreview} alt="avatar" className={styles.avatarImg} />
          : <div className={styles.avatarPlaceholder}>📷</div>
        }
        <span className={styles.avatarLabel}>Cambiar foto</span>
      </div>

      {/* Input de archivo oculto — se activa al hacer clic en el avatar */}
      <input
        ref={fotoRef}
        type="file"
        accept="image/*"
        onChange={handleFoto}
        style={{ display: 'none' }}
      />

      {/* ── FORMULARIO DE PERFIL ── */}
      <form className={styles.formulario} onSubmit={handleGuardar}>

        {/* Email: solo lectura — no se puede cambiar */}
        <div className={styles.campo}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="text"
            value={usuario?.email || ''}
            disabled // Campo deshabilitado — el email no es editable
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Nombre</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Teléfono</label>
          <input
            className={styles.input}
            type="tel"
            placeholder="Tu teléfono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
          />
        </div>

        {/* Mensaje de éxito o error con estilos distintos según el contenido */}
        {mensaje && (
          <p className={`${styles.mensaje} ${mensaje.includes('Error') ? styles.error : styles.exito}`}>
            {mensaje}
          </p>
        )}

        <button className={styles.btnGuardar} type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </form>
    </div>
  )
}

export default Perfil
