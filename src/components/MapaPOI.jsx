// ============================================================
// MapaPOI.jsx — Puntos de interés con votación
// ============================================================
// Permite a los integrantes del viaje sugerir lugares turísticos
// y votar por ellos (👍/👎). El titular puede pasar un lugar
// directamente al itinerario del viaje.
//
// Flujo:
//   1. Cualquier integrante sugiere un lugar (nombre)
//   2. Todos pueden votar positivo o negativo
//   3. El titular puede añadir un lugar al itinerario
//      (se abre un modal para elegir fecha y hora)
//   4. Al añadir al itinerario, el lugar se elimina de la lista de POI
//
// Props:
//   viajeId: ID del viaje
//   esAdmin: booleano — si el usuario es el titular (puede añadir al itinerario)
// ============================================================

import React, { useState, useEffect } from 'react';
import api from '../api';
import styles from './MapaPOI.module.css';

const MapaPOI = ({ viajeId, esAdmin }) => {
  const [lugares, setLugares] = useState([])       // Lista de POI del viaje
  const [nuevoNombre, setNuevoNombre] = useState('') // Campo del formulario de sugerencia

  // Estado del modal para añadir un POI al itinerario
  const [modalAberto, setModalAberto] = useState(false)          // Si el modal está abierto
  const [lugarSelecionado, setLugarSelecionado] = useState(null) // POI seleccionado para añadir
  const [dataItinerario, setDataItinerario] = useState('')       // Fecha elegida en el modal
  const [horaItinerario, setHoraItinerario] = useState('')       // Hora elegida en el modal
  const [carregandoAdd, setCarregandoAdd] = useState(false)      // Bloquea el botón mientras procesa
  const [mensagem, setMensagem] = useState('')                   // Mensaje de éxito/error en el modal

  // FUNCIÓN: carregarLugares
  // Llama a GET /api/poi/viaje/:id para obtener todos los POI del viaje
  // con sus puntuaciones y votos actualizados.
  const carregarLugares = async () => {
    try {
      const res = await api.get(`/api/poi/viaje/${viajeId}`);
      setLugares(res.data);
    } catch (err) {
      console.error("Erro ao carregar ranking:", err);
    }
  };

  // Carga los lugares cuando el componente se monta o cambia el viajeId
  useEffect(() => {
    if (viajeId) carregarLugares();
  }, [viajeId]);

  // FUNCIÓN: adicionarLugar
  // Llama a POST /api/poi/nuevo para sugerir un nuevo punto de interés.
  // Después recarga la lista para mostrar el nuevo lugar.
  const adicionarLugar = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return; // No enviar si el campo está vacío
    console.log("Enviando para o ID da viagem:", viajeId);
    try {
      await api.post('/api/poi/nuevo', {
        nombre: nuevoNombre,
        viaje_id: Number(viajeId), // El backend espera un número, no un string
      });
      setNuevoNombre('');    // Limpia el campo
      carregarLugares();     // Recarga la lista
    } catch (err) {
      console.error("Erro ao sugerir local:", err);
    }
  };

  // FUNCIÓN: votar
  // Llama a POST /api/poi/votar con el ID del POI y el tipo de voto ('up' o 'down').
  // Después recarga la lista para reflejar la nueva puntuación.
  const votar = async (poiId, tipo) => {
    try {
      await api.post('/api/poi/votar', { poiId, tipo });
      carregarLugares();
    } catch (err) {
      console.error("Erro ao votar:", err);
    }
  };

  // FUNCIÓN: prepararAdicionAoItinerario
  // Abre el modal con el lugar seleccionado y limpia los campos de fecha/hora.
  const prepararAdicionAoItinerario = (lugar) => {
    setLugarSelecionado(lugar);
    setDataItinerario('');
    setHoraItinerario('');
    setMensagem('');
    setModalAberto(true);
  };

  // FUNCIÓN: fecharModal
  // Cierra el modal y resetea el lugar seleccionado.
  const fecharModal = () => {
    setModalAberto(false);
    setLugarSelecionado(null);
  };

  // FUNCIÓN: confirmarAdicionarAoItinerario
  // Cuando el titular confirma en el modal:
  //   1. Crea un evento en el itinerario (POST /api/itinerarios/viaje/:id)
  //      con los datos del lugar + fecha y hora elegidas
  //   2. Elimina el lugar de la lista de POI (DELETE /api/poi/:id)
  //   3. Muestra mensaje de éxito y cierra el modal
  const confirmarAdicionarAoItinerario = async () => {
    if (!dataItinerario || !horaItinerario) {
      setMensagem('Por favor, preencha a data e a hora.');
      return;
    }
    setCarregandoAdd(true);
    try {
      // Paso 1: Añade el lugar al itinerario
      await api.post(`/api/itinerarios/viaje/${viajeId}`, {
        nombre_local: lugarSelecionado.nombre,
        direccion: lugarSelecionado.direccion || '',
        fecha: dataItinerario,
        hora: horaItinerario,
      });

      // Paso 2: Elimina el lugar de los POI (ya está en el itinerario)
      await api.delete(`/api/poi/${lugarSelecionado.id}`);

      setMensagem('✅ Adicionado ao itinerário com sucesso!');
      // Cierra el modal y recarga la lista después de 1.5 segundos (para que se vea el mensaje)
      setTimeout(() => {
        fecharModal();
        carregarLugares();
      }, 1500);
    } catch (err) {
      console.error("Erro:", err);
      setMensagem('❌ Erro ao adicionar. Tente novamente.');
    } finally {
      setCarregandoAdd(false);
    }
  };

  return (
    <div className={styles.container}>

      {/* ── FORMULARIO PARA SUGERIR UN LUGAR ── */}
      <h3>Sugerir Ponto Turístico</h3>
      <form onSubmit={adicionarLugar} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Nome do lugar..."
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <button type="submit" className={styles.btn}>Adicionar</button>
      </form>

      {/* ── RANKING DE LUGARES ── */}
      {/* Muestra la lista de POI con sus puntuaciones y botones de votación */}
      <div className={styles.ranking}>
        {lugares.map((lugar) => (
          <div key={lugar.id} className={styles.item}>
            <span>
              {lugar.nombre} <strong>({lugar.puntuacion_total || 0} pts)</strong>
            </span>
            <div className={styles.votos}>
              {/* Botones de voto — cualquier integrante puede votar */}
              <button onClick={() => votar(lugar.id, 'up')}>👍 {lugar.votos_positivos}</button>
              <button onClick={() => votar(lugar.id, 'down')}>👎 {lugar.votos_negativos}</button>

              {/* Botón para añadir al itinerario — solo visible para el administrador */}
              {esAdmin && (
                <button
                  onClick={() => prepararAdicionAoItinerario(lugar)}
                  className={styles.btnAdmin}
                  title="Adicionar ao Itinerário"
                >
                  🗓️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL PARA ELEGIR FECHA Y HORA ── */}
      {/* Solo se muestra cuando el titular hace clic en el botón 🗓️ */}
      {modalAberto && (
        // El overlay cubre toda la pantalla; clic fuera cierra el modal
        <div className={styles.modalOverlay} onClick={fecharModal}>
          {/* e.stopPropagation() evita que el clic dentro del modal cierre el overlay */}
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h4>Adicionar ao Itinerário</h4>
            <p className={styles.modalLugarNome}>📍 {lugarSelecionado?.nombre}</p>

            <label className={styles.label}>Data</label>
            <input
              type="date"
              className={styles.modalInput}
              value={dataItinerario}
              onChange={(e) => setDataItinerario(e.target.value)}
            />

            <label className={styles.label}>Hora</label>
            <input
              type="time"
              className={styles.modalInput}
              value={horaItinerario}
              onChange={(e) => setHoraItinerario(e.target.value)}
            />

            {/* Mensaje de resultado dentro del modal */}
            {mensagem && (
              <p className={styles.mensagem}>{mensagem}</p>
            )}

            <div className={styles.modalBtns}>
              <button onClick={fecharModal} className={styles.btnCancelar}>
                Cancelar
              </button>
              <button
                onClick={confirmarAdicionarAoItinerario}
                className={styles.btnConfirmar}
                disabled={carregandoAdd} // Deshabilita mientras procesa
              >
                {carregandoAdd ? 'Adicionando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaPOI;
