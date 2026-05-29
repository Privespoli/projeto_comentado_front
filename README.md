# ✈️ TravelApp

> Aplicación web para la gestión de viajes en grupo. Organiza, comparte y planifica tus viajes con tus compañeros de aventura.

![TravelApp](https://img.shields.io/badge/status-producción-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js) ![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase) ![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel) ![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)

🌐 **Demo en vivo:** [travelapp-frontend-pi.vercel.app](https://travelapp-frontend-pi.vercel.app)

---

## 📋 Tabla de contenidos

- [Sobre el proyecto](#sobre-el-proyecto)
- [Funcionalidades](#funcionalidades)
- [Permisos por rol](#permisos-por-rol)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Base de datos](#base-de-datos)
- [Deploy](#deploy)
- [Equipo](#equipo)

---

## 🌍 Sobre el proyecto

TravelApp es una aplicación fullstack desarrollada como proyecto final de bootcamp. Permite a los usuarios crear viajes, invitar a otros participantes y gestionar toda la información del viaje de forma colaborativa: tickets, documentos, itinerario, puntos de interés y mucho más.

---

## ✨ Funcionalidades

### Autenticación
- Registro e inicio de sesión con email y contraseña (Supabase Auth)
- Rutas protegidas — solo usuarios autenticados acceden al dashboard
- Cierre de sesión
- Interceptor de respuesta — redirige al login automáticamente si el token expira (401)

### Dashboard
- Vista de todos los viajes donde el usuario es **titular** o **integrante**
- Badge visual que distingue el rol en cada viaje
- Creación de nuevos viajes con imagen, destino y fechas
- Cambio de estado del viaje (Planificación / En curso / Finalizado) — solo el titular

### Gestión del viaje
- **Integrantes** — añadir por email, ver lista con nombres, eliminar (solo titular)
- **Tickets & Docs** — subir PDF e imágenes con título, lugar y fecha; eliminar (titular y integrantes)
- **Itinerario** — gestión de actividades por día, data y hora en orden cronológica, añadir y quitar informaciones (titular)
- **Mapa & POI** — puntos de interés con votación y visualización en mapa, añadir punto de interés, añadir POI al itinerário (integrantes y titular)

### Perfil de usuario
- Foto de perfil, nombre y teléfono
- El nombre se muestra en el header del dashboard y en la lista de integrantes de cada viaje

### Formulario de contacto
- Integrado en la landing page
- Envío de emails via EmailJS sin necesidad de backend

---

## 🔑 Permisos por rol

| Acción | Titular | Integrante |
|--------|---------|------------|
| Ver viajes en el dashboard | ✅ | ✅ |
| Crear viaje | ✅ | ❌ |
| Cambiar estado del viaje | ✅ | ❌ |
| Ver integrantes | ✅ | ✅ |
| Añadir integrantes | ✅ | ❌ |
| Eliminar integrantes | ✅ | ❌ |
| Ver tickets y documentos | ✅ | ✅ |
| Subir tickets y documentos | ✅ | ✅ |
| Eliminar tickets y documentos | ✅ | ❌ |
| Ver itinerario | ✅ | ✅ |
| Gestionar itinerario | ✅ | ❌ |
| Ver mapa y POI | ✅ | ✅ |
| Añadir puntos de interés | ✅ | ✅ |
| Votar puntos de interés | ✅ | ✅ |
| Eliminar puntos de interés | ✅ | ❌ |
| Editar perfil propio | ✅ | ✅ |

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Storage | Supabase Storage |
| Email | EmailJS |
| Deploy frontend | Vercel |
| Deploy backend | Render |
| Control de versiones | Git + GitHub |

---

## 🏗️ Arquitectura

```
Cliente (React + Vite) — Vercel
        ↓ HTTP requests con JWT
Servidor (Node.js + Express) — Render
        ↓ supabaseAdmin (service key)
Supabase (PostgreSQL + Storage + Auth)
```

El backend actúa como intermediario entre el frontend y Supabase, usando la **service key** para saltarse las políticas RLS y tener control total sobre los datos.

---

## 🚀 Instalación

### Requisitos previos
- Node.js v18+
- Cuenta en Supabase
- Cuenta en EmailJS

### Backend

```bash
git clone https://github.com/melinarivera/travelapp_backend.git
cd travelapp_backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
git clone https://github.com/melinarivera/travelapp_frontend.git
cd travelapp_frontend
npm install
npm run dev
```

---

## 🔐 Variables de entorno

### Backend — `.env`

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_KEY=tu_service_role_key
PORT=3000
```

### Frontend

Las credenciales de EmailJS están configuradas en el componente `ContactForm.jsx`.

---

## 📁 Estructura del proyecto

### Backend
```
travelapp_backend/
├── index.js
└── src/
    ├── controllers/
    │   ├── authController.js
    │   ├── viajesController.js
    │   ├── integrantesController.js
    │   ├── documentosController.js
    │   ├── perfilController.js
    │   ├── itinerarioController.js
    │   └── poiController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── viajesRoutes.js
    │   ├── integrantesRoutes.js
    │   ├── documentosRoutes.js
    │   ├── perfilRoutes.js
    │   ├── itinerarioRoutes.js
    │   └── poiRoutes.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── uploadMiddleware.js
    └── supabaseClient.js
```

### Frontend
```
travelapp_frontend/
└── src/
    ├── pages/
    │   ├── AuthPage.jsx
    │   ├── Dashboard.jsx
    │   ├── ViajePage.jsx
    │   └── PerfilPage.jsx
    ├── components/
    │   ├── LoginForm.jsx
    │   ├── RegisterForm.jsx
    │   ├── ViajeCard.jsx
    │   ├── CrearViajeModal.jsx
    │   ├── Integrantes.jsx
    │   ├── TicketsYDocs.jsx
    │   ├── Perfil.jsx
    │   ├── ContactForm.jsx
    │   ├── Itinerario.jsx
    │   └── MapaPOI.jsx
    ├── context/
    │   └── AuthContext.jsx
    └── api.js
```

---

## 🗄️ Base de datos

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `viajes` | Viajes creados por los usuarios |
| `integrantes` | Relación usuario-viaje con rol |
| `documentos` | Tickets y documentos subidos por viaje |
| `perfiles` | Nombre, teléfono y foto de cada usuario |
| `itinerarios` | Nombre, dirección, fecha y hora de cada local añadido en el itinerario |
| `lugares_poi` | Nombre y descripición cada local añadido en el POI |
| `votos_poi` | registro de voto unico por id |

### Storage buckets

| Bucket | Contenido |
|--------|-----------|
| `imagenes-viajes` | Portadas de los viajes |
| `documentos` | PDFs e imágenes de tickets |
| `avatares` | Fotos de perfil de usuarios |

### Seguridad

Todas las tablas tienen **Row Level Security (RLS)** activado en Supabase. El backend usa la `service_role key` a través de `supabaseAdmin` para saltarse las políticas RLS y garantizar el control de acceso desde el servidor.

---

## 🌐 Deploy

| Servicio | Plataforma | URL |
|---------|-----------|-----|
| Frontend | Vercel | [travelapp-frontend-pi.vercel.app](https://travelapp-frontend-pi.vercel.app) |
| Backend | Render | [travelapp-backend-61b8.onrender.com](https://travelapp-backend-61b8.onrender.com) |

> **Nota:** El backend usa el plan gratuito de Render, que se "duerme" tras 15 minutos de inactividad. El primer request puede tardar ~50 segundos en responder.

---

## 👩‍💻 Equipo

| Desarrolladora | Áreas |
|---------------|-------|
| **Melina Rivera** | Backend (auth, viajes, integrantes, documentos, perfil), frontend (dashboard, tickets & docs, perfil, contacto), base de datos, interceptores HTTP, deploy |
| **Priscila Nunes** | Backend (registro, itinerario, mapa & POI, votación), frontend (itinerario, mapa & POI), diseño visual, paleta de colores, cursor personalizado |

---

## 📄 Licencia

### © 2026 Priscila Nunes & Melina Rivera. Todos los derechos reservados.

Este proyecto es **software propietario**. El código fuente se comparte públicamente con fines de **exhibición y portfolio personal** únicamente.

**Queda estrictamente prohibido**, sin autorización escrita y expresa de las autoras:

- Clonar, copiar o descargar este repositorio con fines distintos a la visualización.
- Distribuir, sublicensiar o vender el código, en su totalidad o en parte.
- Usar este proyecto como base para otros proyectos, ya sean personales o comerciales.
- Modificar, descompilar o crear obras derivadas a partir de este código.

Para solicitar permisos de uso o colaboración: [@melinarivera](https://github.com/melinarivera) · [@Privespoli](https://github.com/Privespoli)

> El hecho de que este repositorio sea público **no implica** que se otorgue ningún tipo de licencia de uso, copia o distribución.
