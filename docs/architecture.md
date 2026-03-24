# Arquitectura del Sistema

## Overview
EmotiWeb utiliza un modelo Cliente-Servidor. El cliente es una Single Page Application (SPA), y el servidor provee una API RESTful stateless.

## Backend (Node.js + Express)
Se está transicionando la arquitectura hacia un patrón **N-Tier (Capas)** estricto para mitigar el acoplamiento actual:
1. **Controllers (Controladores):** Responsables únicamente de la validación del request (I/O HTTP) y orquestación de la delegación al servicio.
2. **Service Layer (Servicios) [EN PROGRESO]:** Contiene las lógicas y reglas de negocio puras independizadas de peticiones HTTP (Cálculo de dificultades, asignaciones de badging, validación contextual).
3. **Data Access Layer (Repositories):** Responsable estricto del mapeo de entidades e interacción con MySQL.

## Frontend (React)
El cliente delega el estilo a *Tailwind CSS* utilizando utilitarios atómicos.
- **Componentes Mínimos:** Los componentes de los juegos deben delegar la renderización del UI, manejando únicamente callbacks.
- **Manejo de Estado Global [EN PROGRESO]:** Transición hacia patrones de estado globales optimizados (Zustand preferiblemente), para separar lógica de Sesión de la lógica de Autenticación, eliminando constructos de "God Contexts".
