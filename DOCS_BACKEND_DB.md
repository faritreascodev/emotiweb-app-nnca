# 🐻 Guía Técnica EmotiWeb: Backend & Base de Datos

Esta guía está diseñada para tu presentación de **Programación** y **Bases de Datos 1**. Incluye la solución a problemas de codificación (UTF-8/Emojis) y consultas SQL avanzadas para demostrar el dominio del sistema.

---

## 🛠️ 1. Solución de Codificación (Emojis y Tildes)

Si ves símbolos extraños como `ðŸ˜Š` en DBeaver, es porque la base de datos se creó antes de configurar el soporte completo para `utf8mb4`.

### **Acción Requerida (Reset de DB):**
Para aplicar los cambios de codificación que he configurado en `docker-compose.yml` e `init.sql`, debes recrear el contenedor:

1. Detén y elimina los volúmenes (¡Esto borrará los datos actuales!):
   ```bash
   docker compose down -v
   ```
2. Inicia todo de nuevo:
   ```bash
   docker compose up --build -d
   ```

### **Configuración en DBeaver:**
Al conectar DBeaver a MySQL, asegúrate de:
1. En la pestaña **Driver Properties**, busca `characterEncoding` y ponlo en `utf8mb4`.
2. Busca `allowPublicKeyRetrieval` y ponlo en `TRUE` si tienes problemas de conexión.

---

## 📚 2. Consultas de Demostración (Para Base de Datos 1)

Aquí tienes consultas SQL que impresionarán a tu profesor, cubriendo joins, agregaciones y lógica de negocio.

### **A. Nivel de Dominio por Estudiante (Aggregates & Joins)**
Muestra qué tan bien conoce cada niño las emociones.
```sql
SELECT 
    u.nombre AS Estudiante,
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

### **B. Reporte de Estrellas y Actividad (Group By)**
Resumen de puntos ganados por cada pequeño aventurero.
```sql
SELECT 
    u.nombre,
    u.avatar,
    pu.total_estrellas AS Estrellas_Totales,
    pu.total_juegos_jugados AS Juegos,
    MAX(sj.fecha_fin) AS Ultima_Vez_Jugado
FROM usuarios u
LEFT JOIN progreso_usuario pu ON u.id = pu.usuario_id
LEFT JOIN sesiones_juego sj ON u.id = sj.usuario_id
WHERE u.tipo = 'estudiante'
GROUP BY u.id, u.nombre, u.avatar, pu.total_estrellas, pu.total_juegos_jugados;
```

### **C. Análisis de Dificultad de Situaciones**
¿Cuáles son las situaciones que más aparecen en los juegos?
```sql
SELECT 
    j.titulo AS Juego,
    s.texto AS Situacion,
    e.emoji,
    e.nombre_es AS Emocion_Correcta
FROM situaciones s
JOIN juegos j ON s.juego_id = j.id
JOIN emociones e ON s.emocion_correcta = e.id
ORDER BY j.titulo;
```

---

## 🚀 3. API Documentation (Swagger)

La documentación está "perfectamente hecha" siguiendo el estándar OpenAPI 3.0.

*   **URL:** `http://localhost:3001/api-docs`
*   **Características:**
    *   **Auth:** Prueba el `/register` y `/login`.
    *   **Seguridad:** Copia el `token` del login y úsalo en el botón **"Authorize"** (arriba a la derecha) para desbloquear los demás endpoints.
    *   **Admin:** El endpoint `/api/parent/students` ahora requiere rol `admin` o `padre`.

---

## 🏗️ 4. Estructura de la Base de Datos (Argumentos para Clase)

Si te preguntan por el diseño:
1.  **Integridad Referencial:** Usamos claves foráneas con `ON DELETE CASCADE` para que si borras un usuario, su progreso se limpie automáticamente.
2.  **Optimización:** Usamos `ENUM` para tipos de usuario, lo cual es más eficiente que `VARCHAR`.
3.  **Seguridad:** La tabla `usuarios` no guarda contraseñas, solo `password_hash` (Bcrypt).
4.  **Codificación:** Usamos `utf8mb4_unicode_ci` para soportar emojis, vital para una app infantil.
