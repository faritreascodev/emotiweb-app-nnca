# 🎯 GUÍA RÁPIDA DE INICIO - EmotiWeb

## 🚀 Inicio Rápido (5 minutos)

### 1. Levantar el Sistema

```bash
# Desde la raíz del proyecto
docker compose down -v  # Limpiar datos anteriores
docker compose up --build -d  # Iniciar todo
```

**Esperar ~30 segundos** para que MySQL inicialice.

### 2. Verificar que Todo Funciona

```bash
# Ver estado de los servicios
docker compose ps

# Deberías ver 3 servicios "running":
# - emotiweb-mysql
# - emotiweb-backend
# - emotiweb-frontend
```

### 3. Acceder a la Aplicación

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interfaz de usuario |
| **Backend API** | http://localhost:3001 | API REST |
| **Swagger Docs** | http://localhost:3001/api-docs | Documentación interactiva |
| **MySQL** | localhost:3307 | Base de datos |

---

## 👥 Usuarios de Prueba

| Email | Password | Rol | Qué Puede Hacer |
|-------|----------|-----|-----------------|
| `estudiante@test.com` | `password123` | 🐻 Estudiante | Jugar, ver progreso, ganar logros |
| `padre@test.com` | `password123` | 👨 Padre | Ver progreso de hijos, vincular estudiantes |
| `admin@test.com` | `password123` | 🎖️ Admin | Dashboard completo, gestión de usuarios |

---

## 🎮 Flujo de Prueba Completo

### Como Estudiante

1. **Login**: http://localhost:3000/login
   - Email: `estudiante@test.com`
   - Password: `password123`

2. **Seleccionar Juego**: Click en cualquier juego

3. **Jugar**: 
   - Responde las preguntas
   - Gana estrellas por respuestas correctas

4. **Ver Progreso**: 
   - Dashboard muestra estrellas, emociones, logros

5. **Desbloquear Logros**:
   - Primer juego → 👣 Primeros Pasos
   - 5 respuestas correctas → ⭐ Coleccionista (si llegas a 10 estrellas)

### Como Padre

1. **Login**: http://localhost:3000/login
   - Email: `padre@test.com`
   - Password: `password123`

2. **Ver Dashboard Padre**:
   - Lista de hijos vinculados
   - Progreso de cada hijo
   - Logros obtenidos

3. **Ver Detalle de Hijo**:
   - Click en un estudiante
   - Ver emociones dominadas
   - Ver historial de sesiones

### Como Admin

1. **Login**: http://localhost:3000/login
   - Email: `admin@test.com`
   - Password: `password123`

2. **Dashboard Administrativo**:
   - Estadísticas del sistema
   - Usuarios activos
   - Juegos más jugados
   - Emociones más difíciles

---

## 📡 Pruebas con Swagger

### Acceso

1. Ir a: http://localhost:3001/api-docs
2. Verás la documentación interactiva de la API

### Autenticación

1. **Login**:
   ```
   POST /api/auth/login
   {
     "email": "estudiante@test.com",
     "password": "password123"
   }
   ```

2. **Copiar Token**: De la respuesta, copia el valor de `token`

3. **Autorizar**:
   - Click en botón "Authorize" (arriba a la derecha)
   - Pegar token
   - Click "Authorize"

### Endpoints Clave para Probar

#### 1. Ver Juegos Disponibles
```
GET /api/games
```

#### 2. Iniciar Sesión de Juego
```
POST /api/sessions
{
  "juegoId": "situation"
}
```
**Copiar el `id` de la respuesta** (ej: 1)

#### 3. Registrar Respuesta (NUEVO)
```
POST /api/sessions/1/answer
{
  "situacionId": 1,
  "emocionSeleccionada": "joy",
  "emocionCorrecta": "joy",
  "tiempoRespuesta": 2500,
  "numeroRonda": 1
}
```

#### 4. Finalizar Sesión
```
POST /api/sessions/1/finish
{
  "rondasJugadas": 5,
  "rondasCorrectas": 5
}
```
**Nota**: La respuesta incluirá `nuevos_logros` si desbloqueaste alguno!

#### 5. Ver Progreso Actualizado
```
GET /api/progress
```
Verás:
- Estrellas totales
- Emociones aprendidas con nivel de dominio
- Logros obtenidos
- Logros disponibles

#### 6. Ver Logros (NUEVO)
```
GET /api/progress/achievements
```

#### 7. Como Padre - Ver Mis Hijos (NUEVO)
```
GET /api/parent/my-children
```

#### 8. Como Admin - Dashboard (NUEVO)
```
GET /api/admin/dashboard
```

---

## 🗄️ Consultas SQL Útiles

### Conectar a MySQL

```bash
# Desde terminal
docker exec -it emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 emotiweb_db
```

### Consultas de Demostración

#### 1. Ver Progreso de Estudiantes
```sql
SELECT 
    u.nombre,
    u.avatar,
    p.total_estrellas,
    p.total_juegos_jugados
FROM usuarios u
LEFT JOIN progreso_usuario p ON u.id = p.usuario_id
WHERE u.tipo = 'estudiante';
```

#### 2. Ver Emociones Aprendidas
```sql
SELECT 
    u.nombre AS Estudiante,
    e.emoji,
    e.nombre_es AS Emocion,
    ea.nivel_dominio AS Dominio,
    ea.veces_identificada_correctamente AS Aciertos,
    ea.veces_identificada_incorrectamente AS Errores
FROM usuarios u
JOIN emociones_aprendidas ea ON u.id = ea.usuario_id
JOIN emociones e ON ea.emocion_id = e.id
WHERE u.tipo = 'estudiante'
ORDER BY ea.nivel_dominio DESC;
```

#### 3. Ver Logros Obtenidos (NUEVO)
```sql
SELECT 
    u.nombre,
    l.icono,
    l.nombre AS Logro,
    lu.fecha_obtencion
FROM usuarios u
JOIN logros_usuario lu ON u.id = lu.usuario_id
JOIN logros l ON lu.logro_id = l.id
ORDER BY lu.fecha_obtencion DESC;
```

#### 4. Ver Relaciones Padre-Hijo (NUEVO)
```sql
SELECT 
    p.nombre AS Padre,
    e.nombre AS Hijo,
    rph.fecha_vinculacion
FROM relaciones_padre_hijo rph
JOIN usuarios p ON rph.padre_id = p.id
JOIN usuarios e ON rph.hijo_id = e.id
WHERE rph.activa = true;
```

#### 5. Ver Respuestas Detalladas (NUEVO)
```sql
SELECT 
    u.nombre,
    s.texto AS Situacion,
    rj.emocion_seleccionada,
    rj.emocion_correcta,
    rj.es_correcta,
    rj.tiempo_respuesta_ms,
    rj.numero_ronda
FROM respuestas_juego rj
JOIN sesiones_juego sj ON rj.sesion_id = sj.id
JOIN usuarios u ON sj.usuario_id = u.id
JOIN situaciones s ON rj.situacion_id = s.id
ORDER BY rj.fecha_respuesta DESC
LIMIT 10;
```

---

## 🎯 Demostración de Triggers

### Trigger 1: Crear Progreso Automático

```sql
-- Crear nuevo estudiante
INSERT INTO usuarios (nombre, email, password_hash, tipo, avatar)
VALUES ('Nuevo Estudiante', 'nuevo@test.com', 'hash', 'estudiante', '🦊');

-- Verificar que se creó progreso automáticamente
SELECT * FROM progreso_usuario WHERE usuario_id = LAST_INSERT_ID();
```

### Trigger 2: Actualizar Progreso al Finalizar (MEJORADO)

```sql
-- Simular finalización de sesión
UPDATE sesiones_juego 
SET completada = true, 
    rondas_jugadas = 5, 
    rondas_correctas = 5,
    estrellas_ganadas = 5
WHERE id = 1;

-- Ver progreso actualizado
SELECT * FROM progreso_usuario WHERE usuario_id = 1;
```

### Trigger 3: Actualizar Emoción Aprendida (NUEVO)

```sql
-- Insertar respuesta
INSERT INTO respuestas_juego 
    (sesion_id, situacion_id, emocion_seleccionada, emocion_correcta, es_correcta, numero_ronda)
VALUES 
    (1, 1, 'joy', 'joy', true, 1);

-- Ver emoción aprendida actualizada
SELECT * FROM emociones_aprendidas 
WHERE usuario_id = 1 AND emocion_id = 'joy';
```

---

## 🐛 Solución de Problemas

### MySQL no inicia

```bash
# Ver logs
docker compose logs db

# Recrear volúmenes
docker compose down -v
docker compose up --build -d
```

### Backend no se conecta

```bash
# Ver logs del backend
docker compose logs backend

# Verificar que MySQL esté listo
docker compose ps
```

### Frontend no carga

```bash
# Ver logs del frontend
docker compose logs frontend

# Verificar que el backend esté corriendo
curl http://localhost:3001/health
```

### Emojis se ven mal

```bash
# Recrear base de datos con utf8mb4
docker compose down -v
docker compose up --build -d
```

---

## 📊 Métricas del Sistema

### Después de Jugar 1 Partida Perfecta

- ✅ Estrellas: 5
- ✅ Juegos Jugados: 1
- ✅ Respuestas Correctas: 5
- ✅ Logros Desbloqueados: 2
  - 👣 Primeros Pasos
  - 💯 Juego Perfecto

### Después de 3 Partidas

- ✅ Estrellas: 15
- ✅ Juegos Jugados: 3
- ✅ Logros Desbloqueados: 3+
  - 👣 Primeros Pasos
  - ⭐ Coleccionista de Estrellas
  - 💯 Juego Perfecto

---

## 🎓 Para la Presentación

### Demostración Sugerida (10 minutos)

1. **Mostrar Swagger** (2 min)
   - Explicar arquitectura REST
   - Mostrar endpoints organizados

2. **Login y Jugar** (3 min)
   - Login como estudiante
   - Jugar 1 partida completa
   - Mostrar logro desbloqueado

3. **Vista de Padre** (2 min)
   - Login como padre
   - Mostrar progreso del hijo
   - Explicar vinculación

4. **Dashboard Admin** (2 min)
   - Login como admin
   - Mostrar estadísticas del sistema
   - Explicar gestión de usuarios

5. **Base de Datos** (1 min)
   - Mostrar triggers en acción
   - Consulta SQL de emociones aprendidas

### Puntos Clave a Mencionar

✅ **Arquitectura Fullstack**
- Frontend: React + TypeScript + Tailwind
- Backend: Node.js + Express
- Base de Datos: MySQL con triggers

✅ **Características Técnicas**
- Autenticación JWT
- Triggers automáticos
- API RESTful documentada
- Docker para deployment

✅ **Funcionalidades Completas**
- 3 roles completamente funcionales
- Sistema de progreso con persistencia
- Tracking detallado de respuestas
- Sistema de logros gamificado
- Gestión padre-hijo

---

## 📞 Comandos de Emergencia

```bash
# Reiniciar todo
docker compose restart

# Ver todos los logs
docker compose logs -f

# Limpiar y empezar de cero
docker compose down -v
docker system prune -f
docker compose up --build -d

# Acceder a MySQL directamente
docker exec -it emotiweb-mysql mysql -u root -proot_pass_2026

# Ver espacio en disco
docker system df
```

---

**¡Listo para presentar!** 🚀✨

Para más detalles, ver:
- `README.md` - Documentación completa
- `MEJORAS_IMPLEMENTADAS.md` - Lista de mejoras
- `DOCS_BACKEND_DB.md` - Guía técnica original
