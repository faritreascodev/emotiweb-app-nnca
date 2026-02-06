# 🎓 Guía de Presentación: EmotiWeb (Programación + Base de Datos)

Esta guía te ayudará a responder las 4 preguntas clave de tu profesor y a realizar las pruebas en Swagger paso a paso.

---

## 🏗️ 1. Parte de la Base de Datos (Explicación)
El sistema utiliza **MySQL 8.0**. El diseño está normalizado para manejar usuarios, dinámicas de juego y seguimiento emocional en tiempo real.

*   **Entidades Principales:** `usuarios`, `emociones`, `juegos`, `situaciones`.
*   **Seguimiento Dinámico:** `sesiones_juego` (historial) y `progreso_usuario` (totales acumulados).
*   **Integridad:** Claves foráneas con `CASCADE` y soporte completo para **UTF-8 (utf8mb4)** para emojis.

---

## ⚡ 2. El "Stock": Lógica de Modificación (Triggers)
El profesor quiere ver una modificación automática (como reducir stock). En EmotiWeb, usamos un **TRIGGER** para que cuando un niño termine un juego, su progreso global se actualice automáticamente sin que el programador tenga que hacer un `UPDATE` manual.

### **El Trigger (`tr_actualizar_progreso_al_finalizar_sesion`):**
Cuando la tabla `sesiones_juego` cambia el estado de una sesión a `completada = true`, el trigger:
1.  **Suma** las estrellas ganadas al total del usuario.
2.  **Incrementa** el contador de juegos jugados.
3.  **Actualiza** la fecha de última actividad.

*Esto demuestra dominio avanzado de bases de datos (automatización via triggers/disparadores).*

---

## 💻 3. Framework y Tecnologías Usadas
Dile al profesor exactamente esto:
*   **Backend:** Node.js con el framework **Express.js**.
*   **Arquitectura:** REST API (JSON).
*   **Librerías Clave:**
    *   **mysql2:** Driver para conectar con la base de datos.
    *   **Joi:** Para validación de datos (que no entren correos mal escritos, etc).
    *   **JWT:** Para autenticación segura (Tokens).
    *   **Swagger:** Para la documentación interactiva que vas a mostrar.
*   **Infraestructura:** **Docker & Docker Compose** para asegurar que el sistema corra igual en cualquier computadora.

---

## 🚀 4. Pruebas en Swagger (Paso a Paso)

Abre `http://localhost:3001/api-docs` y sigue este flujo para demostrar el proyecto:

### **Paso 1: Login (Prueba de Seguridad)**
1.  Ve a `POST /api/auth/login`.
2.  Dale a "Try it out".
3.  Usa: `estudiante@test.com` / `password123`.
4.  Copia el valor del `"token"` que aparece en la respuesta.
5.  Sube arriba del todo, busca el botón **"Authorize"**, pega el token y dale a **Authorize**.

### **Paso 2: Ver Juegos (Prueba de Consulta)**
1.  Ve a `GET /api/games`.
2.  Dale a "Execute". Verás los juegos disponibles (`face-match`, `situation`, etc).

### **Paso 3: Iniciar Juego (Prueba de Inserción)**
1.  Ve a `POST /api/sessions`.
2.  Usa el JSON: `{"juegoId": "situation"}`.
3.  **Copia el "id"** de la sesión que se creó (ej: `1`).

### **Paso 4: Finalizar Juego (Prueba de Modificación - ¡EL TRIGGER!)**
1.  Ve a `POST /api/sessions/{id}/finish`.
2.  Pega el ID de la sesión en el campo `id`.
3.  Usa el JSON: `{"rondasJugadas": 5, "rondasCorrectas": 5}`.
4.  Dale a "Execute".

### **Paso 5: Verificar Progreso (Demostración Final)**
1.  Ve a `GET /api/progress/stats`.
2.  Dale a "Execute".
3.  **¡Mira!** Las estrellas ahora son `5` y los juegos jugados `1`. El **Trigger** hizo su magia en la base de datos.
