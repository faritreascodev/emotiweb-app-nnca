# Infraestructura, Observabilidad e Implementación

## Setup de Contenedores y Docking
El proyecto consolida una arquitectura de dos imágenes: Node y Nginx/Vite configuradas con un orquestador Compose que auto-enruta el cluster aislado de MySQL.

**Variables Críticas del Entorno (Inyectadas en Deployment):**
- Keys Firmantes (JWT)
- Credenciales Base de Datos
- Dominios Internos del Reverse Proxy para el API endpoint.

## Integración Continua Inicial (Pre-merge Workflow)
La estrategia definida de release consta de checkeos estáticos bajo Actions de Repositorio (es ej: Github Action/GitlabCI) que exigen:
1. `npm run lint` validando el conjunto de reglas de formateo strictas sin incidencias (warns tolerados, no errors). 
2. `tsc --noEmit` confirmación de typechecking para fallar instantáneamente con cast-types rotos.
3. Futuros scripts de simulación de test (`npx jest`) sobre los servicios funcionales con coverage gate del 80%.
