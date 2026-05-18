// ============================================================
// Itinerario.jsx — Gestión del itinerario del viaje
// ============================================================
// Muestra los eventos del viaje organizados en una timeline
// agrupada por días. Si el usuario es administrador (titular),
// puede añadir y eliminar eventos.
//
// Props:
//   esAdmin: booleano — si el usuario puede editar el itinerario
//
// Nota: obtiene el :id del viaje directamente de la URL con useParams()
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import styles from './Itinerario.module.css';

const Itinerario = ({ esAdmin }) => {
  const { id } = useParams()          // ID del viaje obtenido de la URL (/viaje/:id)
  const [itinerario, setItinerario] = useState([])  // Lista completa de eventos
  const [loading, setLoading] = useState(true)

  // Estado del formulario para añadir un nuevo evento
  const [form, setForm] = useState({
    nombre_local: '', // Nombre del lugar (ej: "Restaurante La Paz")
    direccion: '',    // Dirección opcional
    fecha: '',        // Fecha del evento
    hora: ''          // Hora del evento
  });

  // FUNCIÓN: fetchItinerario
  // Llama a GET /api/itinerarios/viaje/:id para cargar todos los eventos del viaje.
  // Se llama al montar el componente y después de añadir/eliminar eventos.
  const fetchItinerario = async () => {
    try {
      const res = await api.get(`/api/itinerarios/viaje/${id}`);
      setItinerario(res.data.itinerario);
    } catch (error) {
      console.error("Erro ao buscar itinerário", error);
    } finally {
      setLoading(false);
    }
  };

  // Carga el itinerario cuando el componente se monta o cambia el id
  useEffect(() => { fetchItinerario(); }, [id]);

  // FUNCIÓN: handleSubmit
  // Envía el formulario para añadir un nuevo evento al itinerario.
  // Llama a POST /api/itinerarios/viaje/:id con los datos del form.
  // Tras crear el evento, limpia el formulario y recarga la lista.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/itinerarios/viaje/${id}`, form);
      setForm({ nombre_local: '', direccion: '', fecha: '', hora: '' }); // Resetea el formulario
      fetchItinerario(); // Recarga la lista para mostrar el nuevo evento
    } catch (error) {
      alert("Error al añadir item al itinerario");
    }
  };

  // FUNCIÓN: handleDelete
  // Pide confirmación al usuario y luego llama a DELETE /api/itinerarios/:itemId.
  const handleDelete = async (itemId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este evento?")) return;
    try {
      await api.delete(`/api/itinerarios/${itemId}`);
      fetchItinerario(); // Recarga la lista después de eliminar
    } catch (error) {
      alert("Error al eliminar el item");
    }
  };

  // AGRUPACIÓN: agrupadoPorFecha
  // Convierte la lista plana de eventos en un objeto donde la clave es la fecha
  // y el valor es un array de eventos de ese día.
  // Ejemplo: { "2026-07-15": [evento1, evento2], "2026-07-16": [evento3] }
  // reduce() va acumulando eventos en grupos según su fecha.
  const agrupadoPorFecha = itinerario.reduce((acc, item) => {
    const fecha = item.fecha;
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(item);
    return acc;
  }, {});

  // Extrae las fechas únicas y las ordena cronológicamente (de la más antigua a la más nueva)
  const fechasOrdenadas = Object.keys(agrupadoPorFecha).sort();

  // FUNCIÓN: formatearFecha
  // Convierte "2026-07-15" a "miércoles, 15 de julio".
  // Se añade T00:00:00 para evitar problemas de zona horaria al crear el Date.
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  };

  if (loading) return <p className={styles.loading}>Cargando itinerario...</p>;

  return (
    <div className={styles.container}>

      {/* ── FORMULARIO PARA AÑADIR EVENTO (solo admin) ── */}
      {esAdmin && (
        <form className={styles.inputContainer} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre del local (ej: Restaurante La Paz)"
            value={form.nombre_local}
            onChange={(e) => setForm({ ...form, nombre_local: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Dirección (opcional)"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
          <div className={styles.rowInputs}>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              required
            />
            <input
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              required
            />
            <button type="submit" className={styles.addBtn}>+ Añadir</button>
          </div>
        </form>
      )}

      {/* ── TIMELINE DE EVENTOS ── */}
      {itinerario.length === 0 ? (
        <p className={styles.emptyMsg}>No hay eventos programados aún.</p>
      ) : (
        <div className={styles.timeline}>
          {/* Itera por cada fecha (día) ordenada cronológicamente */}
          {fechasOrdenadas.map((fecha, diaIdx) => (
            <div key={fecha} className={styles.diaBloque}>

              {/* Cabecera del día con número de día y fecha formateada */}
              <div className={styles.diaHeader}>
                <div className={styles.diaBadge}>Día {diaIdx + 1}</div>
                <span className={styles.diaFecha}>{formatearFecha(fecha)}</span>
              </div>

              {/* Eventos de este día */}
              <div className={styles.eventos}>
                {agrupadoPorFecha[fecha].map((item, idx) => (
                  <div key={item.id} className={styles.eventoRow}>

                    {/* Columna de hora con línea vertical decorativa */}
                    <div className={styles.horaCol}>
                      <span className={styles.hora}>{item.hora.slice(0, 5)}</span> {/* Muestra HH:MM */}
                      <div className={styles.lineaVertical}>
                        <div className={styles.punto} />
                        <div className={styles.lineaVertical}>
                         <div className={styles.punto} />
                        <div className={styles.linea} />
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta del evento con nombre, dirección y botón eliminar */}
                    <div className={styles.card}>
                      <div className={styles.cardInfo}>
                        <p className={styles.nombreLocal}>{item.nombre_local}</p>
                        {item.direccion && (
                          <p className={styles.direccion}>📍 {item.direccion}</p>
                        )}
                      </div>
                      {esAdmin && (
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(item.id)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Itinerario;
