// ============================================================
// DashboardViaje.jsx — Componente placeholder (sin uso activo)
// ============================================================
// Este componente existe pero actualmente no se usa en ninguna
// ruta ni en ningún otro componente. Muestra un grid simple
// con las 4 secciones principales del viaje.
//
// Nota: La funcionalidad real está en ViajePage.jsx, que usa
// un menú de pestañas con los componentes Integrantes,
// TicketsYDocs, Itinerario y MapaPOI.
// ============================================================

import React from 'react';
import styles from './DashboardViaje.module.css';

const DashboardViaje = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard del Viaje</h1>

      {/* Grid con las 4 secciones — actualmente solo con texto de placeholder */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <p>Itinerário</p>
        </div>

        <div className={styles.card}>
          <p>Mapa</p>
        </div>

        <div className={styles.card}>
          <p>Recomendaciones</p>
        </div>

        <div className={styles.card}>
          <p>Integrantes</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardViaje;
