# Esquema de Base de Datos y Persistencia

## Modelo de Datos
La persistencia descansa sobre perfiles de usuarios y entidades de tracking granular (`usuarios`, `situaciones`, `respuestas_juego`, `sesiones_juego`). 

## Reglas de Negocio (Business Rules)
**Anti-pattern en los Triggers actuales:**
Las versiones pasadas contenían lógicas de nivel de dominio de habilidades inyectadas mecánicamente por triggers de MySQL (`tr_actualizar_progreso_al_finalizar_sesion`, `tr_actualizar_emocion_aprendida`). 

## Flujo de Datos Transaccional (Sin Triggers)
1. El Controller recibe "Finalizar Sesión" y llama al método del Service (`GameEngineService.finishSession()`).
2. El Service inicia una Transacción SQL usando connection driver local.
3. Se actualizan acumulados y estadísticas programáticamente tras validar que la data sea congruente.
4. El Service invoca al método publicador de "Nuevo Nivel Aprendido".
5. Commit Transaccional en Base de Datos.
