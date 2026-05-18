// ============================================================
// CrearViajeModal.jsx — Modal para crear un nuevo viaje
// ============================================================
// Ventana emergente (modal) con un formulario para crear un viaje.
// Envía los datos al servidor usando multipart/form-data para
// poder incluir una imagen de portada junto con el resto de campos.
//
// Props:
//   onCerrar: función para cerrar el modal sin guardar
//   onViajeCreado: función que se llama cuando el viaje se crea con
//                 éxito (cierra el modal y recarga la lista)
// ============================================================

import { useState } from 'react'
import api from '../api'
import styles from './CrearViajeModal.module.css'

function CrearViajeModal({ onCerrar, onViajeCreado }) {
  // Campos del formulario
  const [titulo, setTitulo] = useState('')
  const [destino, setDestino] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [imagen, setImagen] = useState(null)     // Archivo de imagen seleccionado
  const [preview, setPreview] = useState(null)   // URL local para previsualizar la imagen antes de subir

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  // FUNCIÓN: handleImagen
  // Se ejecuta al seleccionar un archivo de imagen.
  // URL.createObjectURL crea una URL temporal en memoria del navegador
  // para mostrar la imagen como preview sin necesidad de subirla aún.
  const handleImagen = (e) => {
    const archivo = e.target.files[0]
    if (archivo) {
      setImagen(archivo)
      setPreview(URL.createObjectURL(archivo)) // URL temporal para mostrar la previsualización
    }
  }

  // FUNCIÓN: handleSubmit
  // Envía el formulario al servidor usando FormData.
  // FormData es necesario para enviar archivos binarios (imágenes) junto con texto.
  // La cabecera 'Content-Type: multipart/form-data' indica al servidor que el
  // cuerpo de la petición contiene tanto texto como archivos.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('titulo', titulo)
      formData.append('destino', destino)
      formData.append('fecha_inicio', fechaInicio)
      formData.append('fecha_fin', fechaFin)
      if (imagen) formData.append('imagen', imagen) // Solo añade imagen si el usuario eligió una

      // POST /api/viajes — crea el nuevo viaje en el servidor
      await api.post('/api/viajes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      onViajeCreado() // Notifica al Dashboard que el viaje fue creado → recarga la lista
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el viaje')
    } finally {
      setCargando(false)
    }
  }

  return (
    // El overlay cubre toda la pantalla con fondo semitransparente.
    // Al hacer clic en el overlay (fuera del modal) se cierra.
    <div className={styles.overlay} onClick={onCerrar}>
      {/* e.stopPropagation() evita que el clic dentro del modal cierre el overlay */}
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.titulo}>Nuevo viaje</h2>
          <button className={styles.btnCerrar} onClick={onCerrar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Área de carga de imagen — actúa como botón que abre el input file oculto */}
          <div className={styles.imagenUpload} onClick={() => document.getElementById('inputImagen').click()}>
            {preview
              ? <img src={preview} alt="preview" className={styles.preview} />
              : <div className={styles.imagenPlaceholder}>
                  <span>+ Añadir imagen</span>
                  <span className={styles.imagenSub}>JPG o PNG</span>
                </div>
            }
            {/* El input type="file" está oculto; se activa al hacer clic en el div de arriba */}
            <input
              id="inputImagen"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImagen}
              style={{ display: 'none' }}
            />
          </div>

          {/* Campos del formulario */}
          <div className={styles.campo}>
            <label className={styles.label}>Nombre del viaje</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Ej: Verano en Italia"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Destino</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Ej: Roma, Italia"
              value={destino}
              onChange={e => setDestino(e.target.value)}
              required
            />
          </div>

          {/* Fechas en fila */}
          <div className={styles.fechas}>
            <div className={styles.campo}>
              <label className={styles.label}>Fecha inicio</label>
              <input
                className={styles.input}
                type="date"
                value={fechaInicio}
                onChange={e => setFechaInicio(e.target.value)}
                required
              />
            </div>
            <div className={styles.campo}>
              <label className={styles.label}>Fecha fin</label>
              <input
                className={styles.input}
                type="date"
                value={fechaFin}
                onChange={e => setFechaFin(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btnCrear} disabled={cargando}>
            {cargando ? 'Creando...' : 'Crear viaje'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CrearViajeModal
