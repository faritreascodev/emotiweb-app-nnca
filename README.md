# 🐻 EmotiWeb - Sistema de Aprendizaje Emocional

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![MySQL](https://img.shields.io/badge/mysql-8.0-orange.svg)

Sistema fullstack educativo para enseñar reconocimiento de emociones a niños mediante juegos interactivos.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Arquitectura](#arquitectura)
- [API Documentation](#api-documentation)
- [Base de Datos](#base-de-datos)
- [Roles y Permisos](#roles-y-permisos)

## ✨ Características

### 🎮 Para Estudiantes
- **4 Juegos Interactivos**: Face Match, Situaciones, Drag & Drop, Cuentos
- **Sistema de Progreso**: Estrellas, niveles de dominio emocional
- **Logros y Badges**: 8 logros desbloqueables
- **Tracking Detallado**: Cada respuesta se registra con tiempo y precisión
- **5 Emociones**: Alegría, Tristeza, Enojo, Miedo, Sorpresa

### 👨‍👩‍👧 Para Padres
- **Dashboard de Progreso**: Visualización completa del avance de sus hijos
- **Gestión de Hijos**: Vincular/desvincular estudiantes
- **Estadísticas Detalladas**: Emociones dominadas, sesiones jugadas, logros
- **Historial de Sesiones**: Últimas 10 partidas con detalles

### 🎖️ Para Administradores
- **Dashboard Completo**: Estadísticas del sistema
- **Gestión de Usuarios**: Activar/desactivar cuentas
- **Análisis de Datos**: Juegos más jugados, emociones más difíciles
- **Monitoreo del Sistema**: Health checks y métricas

## 🛠️ Tecnologías

### Backend
- **Node.js** v18+ con Express.js
- **MySQL 8.0** con triggers automáticos
- **JWT** para autenticación
- **Bcrypt** para encriptación de contraseñas
- **Swagger** para documentación API
- **Docker** para containerización

### Frontend
- **React 19** con TypeScript
- **Vite** como build tool
- **Tailwind CSS 4** para estilos
- **Framer Motion** para animaciones
- **React Router** para navegación

## 🚀 Instalación

### Prerequisitos
- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- Git

### Instalación con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd emotiweb-app-nnca

# 2. Configurar variables de entorno (opcional, ya están configuradas)
# Revisar .env en /backend y /frontend

# 3. Iniciar todos los servicios
docker compose up --build -d

# 4. Verificar que todo esté corriendo
docker compose ps
```

Los servicios estarán disponibles en:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs (Swagger)**: http://localhost:3001/api-docs
- **MySQL**: localhost:3307

### Instalación Local (Desarrollo)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## 📖 Uso

### Usuarios de Prueba

El sistema viene con 3 usuarios pre-configurados:

| Email | Password | Rol | Descripción |
|-------|----------|-----|-------------|
| `estudiante@test.com` | `password123` | Estudiante | Puede jugar y ver su progreso |
| `padre@test.com` | `password123` | Padre | Puede ver progreso de hijos vinculados |
| `admin@test.com` | `password123` | Admin | Acceso completo al sistema |

### Flujo de Uso

1. **Login**: Ingresa con uno de los usuarios de prueba
2. **Estudiante**: 
   - Selecciona un juego
   - Completa las rondas
   - Gana estrellas y desbloquea logros
3. **Padre**:
   - Vincula estudiantes desde el dashboard
   - Visualiza progreso detallado
4. **Admin**:
   - Accede al dashboard administrativo
   - Gestiona usuarios y visualiza estadísticas

## 🏗️ Arquitectura

### Estructura del Proyecto

```
emotiweb-app-nnca/
├── backend/
│   ├── database/
│   │   └── init.sql          # Schema + Seeds + Triggers
│   ├── src/
│   │   ├── config/           # Configuración (DB, Swagger, etc)
│   │   ├── controllers/      # Lógica de negocio
│   │   ├── middleware/       # Auth, validación, errores
│   │   ├── models/           # Modelos de datos
│   │   ├── repositories/     # Acceso a datos
│   │   ├── routes/           # Definición de rutas
│   │   └── utils/            # Helpers y utilidades
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # Servicios API
│   │   ├── components/       # Componentes React
│   │   │   ├── animations/   # Animaciones
│   │   │   ├── common/       # Componentes reutilizables
│   │   │   ├── games/        # Juegos
│   │   │   ├── layout/       # Layout components
│   │   │   └── screens/      # Pantallas principales
│   │   ├── context/          # Context API
│   │   ├── hooks/            # Custom hooks
│   │   └── types/            # TypeScript types
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

### Patrón de Arquitectura

**Backend**: Arquitectura en capas (Layered Architecture)
- **Routes** → **Controllers** → **Repositories** → **Database**
- Separación de responsabilidades
- Fácil testing y mantenimiento

**Frontend**: Component-Based Architecture
- Componentes reutilizables
- Context API para estado global
- Custom hooks para lógica compartida

## 📚 API Documentation

### Endpoints Principales

#### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil

#### Games
- `GET /api/games` - Listar juegos
- `GET /api/games/:id/questions` - Obtener preguntas

#### Sessions
- `POST /api/sessions` - Iniciar sesión de juego
- `POST /api/sessions/:id/answer` - Registrar respuesta
- `POST /api/sessions/:id/finish` - Finalizar sesión
- `GET /api/sessions/user` - Historial de sesiones

#### Progress
- `GET /api/progress` - Progreso completo
- `GET /api/progress/stats` - Estadísticas
- `GET /api/progress/emotions` - Emociones aprendidas
- `GET /api/progress/achievements` - Logros

#### Parent
- `GET /api/parent/my-children` - Mis hijos
- `GET /api/parent/child/:id` - Progreso de hijo
- `POST /api/parent/link-child` - Vincular hijo
- `DELETE /api/parent/unlink-child/:id` - Desvincular hijo

#### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Todos los usuarios
- `PUT /api/admin/users/:id/toggle` - Activar/desactivar
- `GET /api/admin/health` - Estado del sistema

### Documentación Interactiva

Accede a Swagger UI en: **http://localhost:3001/api-docs**

## 🗄️ Base de Datos

### Tablas Principales

1. **usuarios** - Usuarios del sistema
2. **emociones** - Catálogo de emociones
3. **juegos** - Catálogo de juegos
4. **situaciones** - Preguntas/situaciones de juegos
5. **sesiones_juego** - Sesiones de juego
6. **respuestas_juego** - Respuestas individuales (NUEVO)
7. **progreso_usuario** - Progreso acumulado
8. **emociones_aprendidas** - Dominio de emociones
9. **relaciones_padre_hijo** - Vínculos padre-hijo (NUEVO)
10. **logros** - Catálogo de logros (NUEVO)
11. **logros_usuario** - Logros obtenidos (NUEVO)

### Triggers Automáticos

1. **tr_crear_progreso_usuario**: Crea registro de progreso al crear estudiante
2. **tr_actualizar_progreso_al_finalizar_sesion**: Actualiza progreso al completar juego
3. **tr_actualizar_emocion_aprendida**: Actualiza nivel de dominio al responder (NUEVO)

### Diagrama ER

```
usuarios (1) ←→ (N) relaciones_padre_hijo (N) ←→ (1) usuarios
usuarios (1) ←→ (1) progreso_usuario
usuarios (1) ←→ (N) sesiones_juego (N) ←→ (1) juegos
sesiones_juego (1) ←→ (N) respuestas_juego (N) ←→ (1) situaciones
usuarios (1) ←→ (N) emociones_aprendidas (N) ←→ (1) emociones
usuarios (1) ←→ (N) logros_usuario (N) ←→ (1) logros
```

## 👥 Roles y Permisos

### Estudiante
✅ Jugar juegos
✅ Ver su propio progreso
✅ Ver sus logros
❌ Ver otros usuarios
❌ Acceso administrativo

### Padre
✅ Todo lo de Estudiante
✅ Vincular/desvincular hijos
✅ Ver progreso de hijos vinculados
✅ Ver estadísticas de hijos
❌ Acceso administrativo

### Admin
✅ Todo lo anterior
✅ Ver todos los usuarios
✅ Activar/desactivar usuarios
✅ Dashboard administrativo
✅ Estadísticas del sistema

## 🔐 Seguridad

- **Autenticación JWT** con tokens seguros
- **Bcrypt** para hash de contraseñas (10 rounds)
- **Helmet** para headers de seguridad
- **Rate Limiting** para prevenir abuso
- **CORS** configurado correctamente
- **Validación** con Joi en todos los endpoints
- **SQL Injection** prevenido con prepared statements

## 🧪 Testing

### Probar con Swagger

1. Accede a http://localhost:3001/api-docs
2. Haz login con `estudiante@test.com` / `password123`
3. Copia el token de la respuesta
4. Click en "Authorize" (arriba a la derecha)
5. Pega el token y autoriza
6. Prueba los endpoints

### Flujo de Prueba Completo

```bash
# 1. Login
POST /api/auth/login
{ "email": "estudiante@test.com", "password": "password123" }

# 2. Ver juegos
GET /api/games

# 3. Iniciar sesión
POST /api/sessions
{ "juegoId": "situation" }

# 4. Registrar respuestas (por cada ronda)
POST /api/sessions/{id}/answer
{
  "situacionId": 1,
  "emocionSeleccionada": "joy",
  "emocionCorrecta": "joy",
  "tiempoRespuesta": 2500,
  "numeroRonda": 1
}

# 5. Finalizar sesión
POST /api/sessions/{id}/finish
{ "rondasJugadas": 5, "rondasCorrectas": 5 }

# 6. Ver progreso actualizado
GET /api/progress
```

## 🐛 Troubleshooting

### La base de datos no se conecta
```bash
# Verificar que MySQL esté corriendo
docker compose ps

# Ver logs de MySQL
docker compose logs db

# Recrear volúmenes
docker compose down -v
docker compose up --build -d
```

### Problemas con emojis
```bash
# Asegúrate de que la DB use utf8mb4
# Recrear la base de datos
docker compose down -v
docker compose up --build -d
```

### El frontend no se conecta al backend
- Verifica que `VITE_API_URL` en `/frontend/.env` apunte a `http://localhost:3001/api`
- Verifica que CORS esté configurado correctamente en el backend

## 📝 Changelog

### v1.0.0 (2026-02-09)

#### ✨ Nuevas Funcionalidades
- Sistema completo de logros/badges con 8 logros
- Tracking detallado de respuestas individuales
- Relaciones padre-hijo con gestión completa
- Dashboard administrativo funcional
- Trigger automático para actualizar dominio emocional
- Endpoint para registrar respuestas individuales
- Sistema de vinculación de hijos para padres

#### 🐛 Correcciones
- Corregido error en server.js (PostgreSQL → MySQL)
- Mejorada validación de acceso padre-hijo
- Optimizadas consultas SQL

#### 🔧 Mejoras
- Documentación Swagger completa
- README comprehensivo
- Mejor estructura de repositorios
- Separación de responsabilidades mejorada

## 👨‍💻 Desarrollo

### Comandos Útiles

```bash
# Desarrollo
npm run dev          # Backend con nodemon
npm run dev          # Frontend con Vite

# Producción
npm start            # Backend
npm run build        # Frontend

# Docker
docker compose up -d              # Iniciar
docker compose down               # Detener
docker compose down -v            # Detener y limpiar volúmenes
docker compose logs -f [service]  # Ver logs
docker compose restart [service]  # Reiniciar servicio
```

### Agregar Nuevas Funcionalidades

1. **Nueva tabla**: Agregar en `backend/database/init.sql`
2. **Nuevo repository**: Crear en `backend/src/repositories/`
3. **Nuevo controller**: Crear en `backend/src/controllers/`
4. **Nuevas rutas**: Agregar en `backend/src/routes/`
5. **Actualizar Swagger**: Documentar con comentarios JSDoc

## 📄 Licencia

Este proyecto es para fines educativos.

## 🤝 Contribuciones

Para contribuir:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Hecho con ❤️ para ayudar a los niños a entender sus emociones** 🐻✨
