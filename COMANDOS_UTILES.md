# 🛠️ COMANDOS ÚTILES - EmotiWeb

## 🐳 Docker Commands

### Inicio y Detención
```bash
# Iniciar todos los servicios
docker compose up -d

# Iniciar con rebuild (después de cambios)
docker compose up --build -d

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (reset completo)
docker compose down -v

# Reiniciar un servicio específico
docker compose restart backend
docker compose restart frontend
docker compose restart db
```

### Logs y Debugging
```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Ver últimas 100 líneas
docker compose logs --tail=100 backend

# Ver estado de servicios
docker compose ps

# Ver uso de recursos
docker stats
```

### Acceso a Contenedores
```bash
# Acceder a bash del backend
docker exec -it emotiweb-backend sh

# Acceder a bash del frontend
docker exec -it emotiweb-frontend sh

# Acceder a MySQL
docker exec -it emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 emotiweb_db

# Acceder a MySQL como root
docker exec -it emotiweb-mysql mysql -u root -proot_pass_2026
```

### Limpieza
```bash
# Limpiar contenedores detenidos
docker container prune -f

# Limpiar imágenes no usadas
docker image prune -f

# Limpiar volúmenes no usados
docker volume prune -f

# Limpiar todo (cuidado!)
docker system prune -af --volumes
```

---

## 🗄️ MySQL Commands

### Conexión
```bash
# Desde terminal del host
docker exec -it emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 emotiweb_db

# Una vez dentro de MySQL
USE emotiweb_db;
```

### Consultas Útiles

#### Ver Estructura
```sql
-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE usuarios;
DESCRIBE emociones_aprendidas;
DESCRIBE respuestas_juego;
DESCRIBE logros;

-- Ver triggers
SHOW TRIGGERS;

-- Ver índices
SHOW INDEX FROM usuarios;
```

#### Datos de Prueba
```sql
-- Ver usuarios
SELECT id, nombre, email, tipo, avatar FROM usuarios;

-- Ver progreso de estudiantes
SELECT 
    u.nombre,
    u.avatar,
    p.total_estrellas,
    p.total_juegos_jugados,
    p.total_respuestas_correctas
FROM usuarios u
LEFT JOIN progreso_usuario p ON u.id = p.usuario_id
WHERE u.tipo = 'estudiante';

-- Ver emociones aprendidas
SELECT 
    u.nombre,
    e.emoji,
    e.nombre_es,
    ea.nivel_dominio,
    ea.veces_identificada_correctamente,
    ea.veces_identificada_incorrectamente
FROM emociones_aprendidas ea
JOIN usuarios u ON ea.usuario_id = u.id
JOIN emociones e ON ea.emocion_id = e.id
ORDER BY ea.nivel_dominio DESC;

-- Ver logros obtenidos
SELECT 
    u.nombre,
    l.icono,
    l.nombre AS logro,
    lu.fecha_obtencion
FROM logros_usuario lu
JOIN usuarios u ON lu.usuario_id = u.id
JOIN logros l ON lu.logro_id = l.id
ORDER BY lu.fecha_obtencion DESC;

-- Ver relaciones padre-hijo
SELECT 
    p.nombre AS padre,
    e.nombre AS hijo,
    rph.fecha_vinculacion,
    rph.activa
FROM relaciones_padre_hijo rph
JOIN usuarios p ON rph.padre_id = p.id
JOIN usuarios e ON rph.hijo_id = e.id;

-- Ver sesiones recientes
SELECT 
    u.nombre,
    j.titulo,
    sj.fecha_inicio,
    sj.fecha_fin,
    sj.rondas_jugadas,
    sj.rondas_correctas,
    sj.estrellas_ganadas,
    sj.completada
FROM sesiones_juego sj
JOIN usuarios u ON sj.usuario_id = u.id
JOIN juegos j ON sj.juego_id = j.id
ORDER BY sj.fecha_inicio DESC
LIMIT 10;

-- Ver respuestas detalladas
SELECT 
    u.nombre,
    j.titulo AS juego,
    s.texto AS situacion,
    rj.emocion_seleccionada,
    rj.emocion_correcta,
    rj.es_correcta,
    rj.tiempo_respuesta_ms,
    rj.numero_ronda
FROM respuestas_juego rj
JOIN sesiones_juego sj ON rj.sesion_id = sj.id
JOIN usuarios u ON sj.usuario_id = u.id
JOIN juegos j ON sj.juego_id = j.id
JOIN situaciones s ON rj.situacion_id = s.id
ORDER BY rj.fecha_respuesta DESC
LIMIT 20;
```

#### Estadísticas
```sql
-- Top 5 estudiantes por estrellas
SELECT 
    u.nombre,
    u.avatar,
    p.total_estrellas
FROM usuarios u
JOIN progreso_usuario p ON u.id = p.usuario_id
WHERE u.tipo = 'estudiante'
ORDER BY p.total_estrellas DESC
LIMIT 5;

-- Emociones más difíciles
SELECT 
    e.nombre_es,
    e.emoji,
    COUNT(rj.id) as total_respuestas,
    SUM(CASE WHEN rj.es_correcta = true THEN 1 ELSE 0 END) as correctas,
    SUM(CASE WHEN rj.es_correcta = false THEN 1 ELSE 0 END) as incorrectas,
    ROUND((SUM(CASE WHEN rj.es_correcta = true THEN 1 ELSE 0 END) / COUNT(rj.id) * 100), 2) as precision
FROM emociones e
LEFT JOIN respuestas_juego rj ON e.id = rj.emocion_correcta
GROUP BY e.id, e.nombre_es, e.emoji
HAVING total_respuestas > 0
ORDER BY precision ASC;

-- Juegos más jugados
SELECT 
    j.titulo,
    j.icono,
    COUNT(sj.id) as veces_jugado,
    AVG(sj.rondas_correctas / sj.rondas_jugadas * 100) as precision_promedio
FROM juegos j
LEFT JOIN sesiones_juego sj ON j.id = sj.juego_id AND sj.completada = true
GROUP BY j.id, j.titulo, j.icono
ORDER BY veces_jugado DESC;
```

#### Resetear Datos
```sql
-- CUIDADO: Esto borra todos los datos de prueba

-- Borrar respuestas
DELETE FROM respuestas_juego;

-- Borrar sesiones
DELETE FROM sesiones_juego;

-- Borrar logros de usuarios
DELETE FROM logros_usuario;

-- Borrar emociones aprendidas
DELETE FROM emociones_aprendidas;

-- Borrar progreso
DELETE FROM progreso_usuario;

-- Borrar relaciones
DELETE FROM relaciones_padre_hijo;

-- Resetear auto_increment
ALTER TABLE sesiones_juego AUTO_INCREMENT = 1;
ALTER TABLE respuestas_juego AUTO_INCREMENT = 1;
```

---

## 🔧 Backend Development

### Desarrollo Local (sin Docker)
```bash
cd backend

# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Producción
npm start
```

### Testing API con curl
```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"estudiante@test.com","password":"password123"}'

# Con token (reemplazar TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/auth/profile

# Ver juegos
curl http://localhost:3001/api/games

# Iniciar sesión
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"juegoId":"situation"}'

# Ver progreso
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/progress
```

---

## 🎨 Frontend Development

### Desarrollo Local (sin Docker)
```bash
cd frontend

# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

### Variables de Entorno
```bash
# frontend/.env
VITE_API_URL=http://localhost:3001/api
```

---

## 📊 Monitoring y Debugging

### Ver Uso de Recursos
```bash
# CPU y memoria de contenedores
docker stats

# Espacio en disco
docker system df

# Procesos en contenedor
docker top emotiweb-backend
```

### Exportar/Importar Base de Datos
```bash
# Exportar
docker exec emotiweb-mysql mysqldump -u root -proot_pass_2026 emotiweb_db > backup.sql

# Importar
docker exec -i emotiweb-mysql mysql -u root -proot_pass_2026 emotiweb_db < backup.sql
```

### Network Debugging
```bash
# Ver redes
docker network ls

# Inspeccionar red
docker network inspect emotiweb-app-nnca_emotiweb-network

# Test de conectividad
docker exec emotiweb-backend ping db
```

---

## 🚀 Deployment

### Build de Producción
```bash
# Build de imágenes
docker compose build

# Push a registry (configurar primero)
docker compose push

# Pull en servidor
docker compose pull

# Iniciar en producción
docker compose -f docker-compose.yml up -d
```

### Variables de Entorno Producción
```bash
# Editar .env en backend y frontend
# Cambiar:
# - JWT_SECRET
# - DB_PASSWORD
# - CORS_ORIGIN
# - FRONTEND_URL
```

---

## 🔍 Troubleshooting

### Puerto ya en uso
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3307

# Matar proceso (Windows)
taskkill /PID <PID> /F

# Cambiar puerto en docker-compose.yml
```

### Contenedor no inicia
```bash
# Ver logs detallados
docker compose logs backend

# Ver últimos errores
docker compose logs --tail=50 backend

# Reconstruir imagen
docker compose build --no-cache backend
docker compose up -d backend
```

### Base de datos corrupta
```bash
# Reset completo
docker compose down -v
docker volume rm emotiweb-app-nnca_mysql_data
docker compose up -d
```

### Problemas de permisos
```bash
# Linux/Mac - dar permisos a scripts
chmod +x verify-system.sh

# Windows - ejecutar como administrador
# o usar Git Bash
```

---

## 📝 Git Commands

### Workflow Básico
```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "Descripción del cambio"

# Push
git push origin main

# Pull
git pull origin main
```

### Branches
```bash
# Crear branch
git checkout -b feature/nueva-funcionalidad

# Cambiar de branch
git checkout main

# Merge
git merge feature/nueva-funcionalidad

# Borrar branch
git branch -d feature/nueva-funcionalidad
```

---

## 🎯 Testing Completo

### Script de Verificación
```bash
# Dar permisos (Linux/Mac)
chmod +x verify-system.sh

# Ejecutar
./verify-system.sh

# En Windows (Git Bash)
bash verify-system.sh
```

### Test Manual Completo
```bash
# 1. Reset
docker compose down -v
docker compose up --build -d

# 2. Esperar
sleep 30

# 3. Verificar servicios
curl http://localhost:3001/health
curl http://localhost:3000

# 4. Test de API
# Ver GUIA_RAPIDA.md sección "Pruebas con Swagger"
```

---

## 📚 Documentación

### Generar Documentación
```bash
# Swagger ya está configurado
# Acceder a: http://localhost:3001/api-docs

# Para exportar Swagger JSON
curl http://localhost:3001/api-docs.json > swagger.json
```

### Archivos de Documentación
- `README.md` - Documentación principal
- `GUIA_RAPIDA.md` - Inicio rápido
- `MEJORAS_IMPLEMENTADAS.md` - Detalles técnicos
- `RESUMEN_FINAL.md` - Resumen ejecutivo
- `DOCS_BACKEND_DB.md` - Guía de BD
- `PRESENTACION_GUIA.md` - Guía de presentación

---

## 🔐 Seguridad

### Cambiar Passwords de Producción
```bash
# 1. Generar nuevo hash de password
node -e "console.log(require('bcryptjs').hashSync('nueva_password', 10))"

# 2. Actualizar en base de datos
UPDATE usuarios SET password_hash = 'NUEVO_HASH' WHERE email = 'admin@test.com';

# 3. Cambiar secretos JWT en .env
JWT_SECRET=nuevo_secreto_muy_largo_y_aleatorio
JWT_REFRESH_SECRET=otro_secreto_diferente
```

### Backup de Seguridad
```bash
# Backup completo
docker exec emotiweb-mysql mysqldump -u root -proot_pass_2026 --all-databases > full_backup.sql

# Backup solo datos
docker exec emotiweb-mysql mysqldump -u root -proot_pass_2026 --no-create-info emotiweb_db > data_backup.sql

# Backup solo estructura
docker exec emotiweb-mysql mysqldump -u root -proot_pass_2026 --no-data emotiweb_db > schema_backup.sql
```

---

**Mantén este archivo a mano para referencia rápida!** 🚀
