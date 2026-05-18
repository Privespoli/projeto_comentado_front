// ============================================================
// ContactForm.jsx — Formulario de contacto
// ============================================================
// Formulario que envía un email real usando EmailJS.
// EmailJS es un servicio externo que envía emails directamente
// desde el frontend, sin necesidad de un servidor propio.
//
// Estados del formulario:
//   - enviando: muestra "Enviando..." y deshabilita el botón
//   - enviado: muestra mensaje de éxito durante 3 segundos
//   - error: muestra mensaje si falla el envío
// ============================================================

import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser' // Librería de EmailJS para enviar emails desde el frontend
import styles from './ContactForm.module.css'

function ContactForm() {
  // useRef: referencia directa al elemento <form> del DOM.
  // EmailJS necesita esta referencia para leer los valores de los campos del formulario.
  const formRef = useRef(null)

  const [enviando, setEnviando] = useState(false) // Bloquea el botón mientras se envía
  const [enviado, setEnviado] = useState(false)   // Muestra el mensaje de éxito
  const [error, setError] = useState(null)        // Muestra el mensaje de error

  // FUNCIÓN: handleSubmit
  // Usa emailjs.sendForm() para enviar el formulario al servicio de EmailJS.
  // Los tres IDs (service, template, public key) identifican la cuenta
  // y la plantilla configurada en el panel de EmailJS.
  // Después de enviar:
  //   - Muestra mensaje de éxito
  //   - Resetea el formulario
  //   - Oculta el mensaje de éxito después de 3 segundos
  const handleSubmit = async (e) => {
    e.preventDefault() // Evita recarga de la página
    setEnviando(true)
    setError(null)
    try {
      await emailjs.sendForm(
        'service_xh7k7yy',   // ID del servicio de EmailJS (configurado en su cuenta)
        'template_hasnv2p',  // ID de la plantilla del email (diseño del email recibido)
        formRef.current,     // El formulario HTML — EmailJS lee sus campos (name, email, message)
        '_gDSIJLsB3IcrjGgw' // Clave pública de la cuenta de EmailJS
      )
      setEnviado(true)
      formRef.current.reset()                    // Limpia todos los campos del formulario
      setTimeout(() => setEnviado(false), 3000)  // Oculta el mensaje de éxito tras 3 segundos
    } catch (err) {
      setError('Hubo un error al enviar el mensaje. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Contáctanos</h2>
      <p className={styles.subtitulo}>¿Tienes alguna pregunta? Escríbenos y te respondemos.</p>

      {/* Muestra el formulario O el mensaje de éxito, nunca ambos a la vez */}
      {enviado ? (
        <div className={styles.exito}>
          ✅ Mensaje enviado correctamente. ¡Gracias por escribirnos!
        </div>
      ) : (
        // ref={formRef} conecta el elemento DOM con la referencia de React
        // Los name="" de los campos deben coincidir con las variables de la plantilla EmailJS
        <form ref={formRef} className={styles.formulario} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="name"          // EmailJS usa este name para insertar el valor en la plantilla
            placeholder="Tu nombre *"
            required
          />
          <input
            className={styles.input}
            type="email"
            name="email"         // EmailJS usa este name
            placeholder="Tu email *"
            required
          />
          <textarea
            className={styles.textarea}
            name="message"       // EmailJS usa este name
            placeholder="Tu mensaje *"
            rows={5}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btnEnviar} type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ContactForm
