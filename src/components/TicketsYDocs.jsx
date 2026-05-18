// ============================================================
// TicketsYDocs.jsx — Gestión de tickets y documentos del viaje
// ============================================================
// Permite subir archivos (PDFs o imágenes) asociados al viaje:
// vuelos, reservas de hotel, entradas, etc.
// Cualquier integrante puede subir documentos.
// Solo el titular puede eliminar documentos.
//
// Props:
//   viajeId: ID del viaje
//   esTitular: booleano — si el usuario puede eliminar documentos
// ============================================================

import { useState, useEffect, useRef } from 'react'
import api from '../api'
import styles from './TicketsYDocs.module.css'

function TicketsYDocs({ viajeId, esTitular }) {
  const [documentos, setDocumentos] = useState([]) // Lista de documentos del viaje
  const [cargando, setCargando] = useState(true)

  // Campos del formulario de subida
  const [titulo, setTitulo] = useState('')
  const [lugar, setLugar] = useState('')
  const [fecha, setFecha] = useState('')
  const [archivo, setArchivo] = useState(null) // Archivo seleccionado por el usuario

  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState(null)

  // Referencia al input de archivo para poder limpiarlo manualmente después de subir
  const archivoRef = useRef(null)

  // FUNCIÓN: cargarDocumentos
  // Llama a GET /api/viajes/:id/documentos para obtener la lista.
  // Se llama al montar el componente y tras subir/eliminar un documento.
  const cargarDocumentos = async () => {
    try {
      const res = await api.get(`/api/viajes/${viajeId}/documentos`)
      setDocumentos(res.data.documentos)
    } catch (err) {
      console.error('Error al cargar documentos:', err)
    } finally {
      setCargando(false)
    }
  }

  // Carga los documentos cuando el componente se monta o cambia el viajeId
  useEffect(() => {
    cargarDocumentos()
  }, [viajeId])

  // FUNCIÓN: handleSubir
  // Envía el documento al servidor usando FormData (necesario para archivos binarios).
  // El backend guarda el archivo y devuelve la URL pública donde está alojado.
  // Tras subir: limpia el formulario y recarga la lista de documentos.
  const handleSubir = async (e) => {
    e.preventDefault()
    if (!archivo || !titulo) return setError('Título y archivo son obligatorios')

    setSubiendo(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('titulo', titulo)
      formData.append('lugar', lugar)
      formData.append('fecha', fecha)
      formData.append('archivo', archivo) // El archivo binario (PDF o imagen)

      // POST /api/viajes/:id/documentos — sube el documento al servidor
      await api.post(`/api/viajes/${viajeId}/documentos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Limpia todos los campos del formulario
      setTitulo('')
      setLugar('')
      setFecha('')
      setArchivo(null)
      if (archivoRef.current) archivoRef.current.value = '' // Limpia el input file del DOM
      cargarDocumentos()
    } catch (err) {
      setError('Error al subir el documento')
    } finally {
      setSubiendo(false)
    }
  }

  // FUNCIÓN: handleEliminar
  // Llama a DELETE /api/viajes/:viajeId/documentos/:id para eliminar el documento.
  // Actualiza el estado local sin recargar toda la lista (más eficiente).
  const handleEliminar = async (id) => {
    try {
      await api.delete(`/api/viajes/${viajeId}/documentos/${id}`)
      // Filtra el documento eliminado del estado local directamente
      setDocumentos(prev => prev.filter(doc => doc.id !== id))
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Tickets & Documentos</h2>

      {/* ── FORMULARIO DE SUBIDA ── */}
      {/* Cualquier integrante puede subir documentos */}
      <form className={styles.formulario} onSubmit={handleSubir}>
        <input
          className={styles.input}
          type="text"
          placeholder="Título *"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Lugar"
          value={lugar}
          onChange={e => setLugar(e.target.value)}
        />
        <input
          className={styles.input}
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
        />
        {/* Input de archivo: acepta imágenes y PDFs */}
        <input
          ref={archivoRef}        // Referencia para poder resetearlo manualmente
          className={styles.inputArchivo}
          type="file"
          accept="image/*,.pdf"
          onChange={e => setArchivo(e.target.files[0])}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.btnSubir} type="submit" disabled={subiendo}>
          {subiendo ? 'Subiendo...' : '+ Subir documento'}
        </button>
      </form>

      {/* ── LISTA DE DOCUMENTOS ── */}
      {cargando ? (
        <p className={styles.sinDocs}>Cargando documentos...</p>
      ) : documentos.length === 0 ? (
        <p className={styles.sinDocs}>No hay documentos todavía.</p>
      ) : (
        <ul className={styles.lista}>
          {documentos.map(doc => (
            <li key={doc.id} className={styles.item}>
              <div className={styles.infoDoc}>
                {/* El nombre del documento es un enlace que abre el archivo en nueva pestaña */}
                <a className={styles.nombreDoc} href={doc.archivo_url} target="_blank" rel="noreferrer">
                  {doc.titulo}
                </a>
                {/* Metadatos: lugar y/o fecha separados por punto medio */}
                <span className={styles.metaDoc}>
                  {doc.lugar && `${doc.lugar}`}
                  {doc.lugar && doc.fecha && ' · '}
                  {doc.fecha && `${doc.fecha}`}
                </span>
              </div>
              {/* Botón eliminar solo visible para el titular */}
              {esTitular && (
                <button className={styles.btnEliminar} onClick={() => handleEliminar(doc.id)}>
                  Eliminar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TicketsYDocs
