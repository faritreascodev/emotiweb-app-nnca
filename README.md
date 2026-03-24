# EmotiWeb

Plataforma educativa interactiva diseñada para la enseñanza del reconocimiento de emociones en la etapa infantil a través de módulos gamificados.

## Overview
El proyecto consiste en una aplicación Node.js/Express en el backend acoplada a una base de datos MySQL relacional, y un frontend construido en React 19 con Vite y TailwindCSS. Adopta una arquitectura orientada a servicios (en transición) y diseño basado en componentes para asegurar mantenibilidad y concurrencia.

## Stack Tecnológico
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion
- **Backend:** Node.js 18+, Express, JSON Web Tokens (JWT), Bcrypt
- **Persistencia:** MySQL 8.0
- **Infraestructura:** Docker, Docker Compose

## Estructura del Directorio
```text
.
├── backend/            # API RESTful, modelos, controladores y servicios
├── frontend/           # SPA, componentes React, vistas y estado global
├── docs/               # Documentación técnica (arquitectura, DB, infraestructura)
├── docker-compose.yml  # Orquestador de servicios locales
└── README.md           # Entrypoint de documentación
```

## Documentación Técnica
Todos los lineamientos de arquitectura, patrones de diseño y estándares operacionales están centralizados en `/docs`:
- [Arquitectura de Software](docs/architecture.md)
- [Modelo de Datos y Reglas](docs/database.md)
- [Contratos de API](docs/api.md)
- [Infraestructura y CI/CD](docs/infrastructure.md)

## Instalación y Ejecución

### Requisitos Previos
- Docker y Docker Compose
- Node.js 18+ (Para entorno de desarrollo local sin contenedores)

### Entorno Contenerizado (Recomendado)
```bash
cp .env.example .env
docker compose up --build -d
```
El sistema expondrá: Frontend (`:3000`), Backend/API (`:3001`), MySQL (`:3307`).

### Entorno de Desarrollo Local
Asegúrate de tener una instancia de MySQL corriendo en el puerto 3306.
```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend
cd frontend && npm install && npm run dev
```

## Estado Actual y Roadmap
- [x] Migración a React 19 y Tailwind 4
- [x] Normalización de base de datos
- [ ] Refactorización: Implementar Service Layer en API
- [ ] Refactorización: Implementar estado atómico global en Frontend (Zustand)
- [ ] Implementación de suite de pruebas (Unitarias y E2E)
- [ ] CI/CD Pipelines

## Seguridad
Nunca hagas commit de archivos de entorno locales (`.env`). Referirse a `.env.example` para observar las estructuras y *keys* requeridas por los servicios en tiempo de ejecución.

---
Mantenido por el equipo de ingeniería de EmotiWeb.
