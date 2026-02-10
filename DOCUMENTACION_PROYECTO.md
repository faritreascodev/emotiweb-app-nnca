# DOCUMENTACION TECNICA DEL PROYECTO: EMOTIWEB

## 1. DESCRIPCION GENERAL
EmotiWeb es una plataforma web integral diseñada para el fortalecimiento de la inteligencia emocional en niños y niñas de edad escolar. El sistema combina tecnicas de gamificacion con herramientas de seguimiento pedagogico para permitir que los estudiantes identifiquen, comprendan y gestionen sus emociones fundamentales (alegría, tristeza, enojo, miedo y sorpresa).

## 2. OBJETIVOS DEL SISTEMA
*   Fomentar la alfabetizacion emocional mediante juegos interactivos.
*   Proporcionar a padres y tutores herramientas de visualizacion de datos sobre el progreso emocional.
*   Garantizar una gestion centralizada de usuarios y contenidos para administradores.
*   Implementar una arquitectura escalable y robusta siguiendo los principios de ingenieria de software.

## 3. METODOLOGIA DE DESARROLLO
Se utilizo una metodologia de desarrollo incremental y centrada en el usuario (User-Centered Design). El proceso se dividio en las siguientes fases:
1.  **Analisis y Requerimientos**: Identificacion de las necesidades pedagogicas y tecnicas.
2.  **Diseño de Base de Datos**: Modelado relacional orientado a la integridad y eficiencia.
3.  **Desarrollo del Backend**: Implementacion de una API RESTful con seguridad integrada.
4.  **Desarrollo del Frontend**: Creacion de una interfaz reactiva, accesible y visualmente atractiva para el publico infantil.
5.  **Contenerizacion y Despliegue**: Uso de Docker para asegurar la portabilidad del entorno.

## 4. ARQUITECTURA TECNOLOGICA (TECH STACK)

### 4.1 Backend
*   **Lenguaje**: JavaScript (Node.js).
*   **Framework**: Express.js para el manejo de rutas y middleware.
*   **Seguridad**: JWT (JSON Web Tokens) para autenticacion y Bcrypt para el cifrado de contraseñas.
*   **Validacion**: Librería Joi para asegurar la integridad de los datos de entrada.

### 4.2 Frontend
*   **Biblioteca**: React.js (Vite como herramienta de construccion).
*   **Estilos**: CSS nativo y Tailwind CSS para diseño responsivo.
*   **Animaciones**: Framer Motion para mejorar la experiencia de usuario (UX).
*   **Iconografía**: Lucide React.
*   **Comunicacion**: Axios para el consumo de la API REST.

### 4.3 Base de Datos
*   **Motor**: MySQL 8.0.
*   **Caracteristicas**: Uso de triggers para automatizacion de procesos e integridad referencial estricta.

## 5. DISEÑO DE LA BASE DE DATOS

### 5.1 Entidades Principales
*   **usuarios**: Almacena credenciales, roles y perfiles.
*   **emociones**: Catalogo de estados emocionales con metadatos visuales.
*   **juegos**: Registro de los diferentes tipos de dinamicas disponibles.
*   **situaciones**: Banco de preguntas y escenarios para los juegos.
*   **sesiones_juego**: Historial detallado de cada partida realizada.
*   **progreso_usuario**: Tabla resumen de estadisticas acumuladas.

### 5.2 Lógica en el Motor de Base de Datos
Se implementaron Triggers para desacoplar la lógica de negocio del codigo de aplicacion:
*   **tr_crear_progreso_usuario**: Crea automaticamente el registro de estadisticas al registrar un nuevo estudiante.
*   **tr_actualizar_progreso_al_finalizar_sesion**: Al finalizar una partida, el motor actualiza automaticamente el total de estrellas y juegos jugados del usuario, garantizando la consistencia de los datos sin intervencion manual del servidor de aplicaciones.

### 5.3 Configuracion de Caracteres
El sistema utiliza el conjunto de caracteres `utf8mb4` para permitir el almacenamiento de emojis y caracteres especiales, lo cual es fundamental para una interfaz visual dirigida a niños.

## 6. FUNCIONALIDADES POR ROL

### 6.1 Estudiante (Aventurero)
*   Acceso a juegos como: ¿Como me siento?, Arrastra y Suelta, y Face Match.
*   Sistema de recompensa mediante estrellas.
*   Narrativas sonoras mediante síntesis de voz integradas.

### 6.2 Padre (Guardian)
*   Panel de monitoreo de estudiantes vinculados.
*   Visualizacion de radar emocional (porcentaje de dominio por emocion).
*   Historial de actividad reciente.

### 6.3 Administrador (Coordinador)
*   Gestion total de usuarios (Crear, Editar, Eliminar).
*   Configuracion de parametros del sistema.
*   Visualizacion de estadisticas globales.

## 7. INFRAESTRUCTURA Y DESPLIEGUE
El proyecto esta completamente dockerizado, permitiendo un despliegue inmediato mediante Docker Compose. Esto incluye la orquestacion del contenedor de la base de datos, el servidor API y el servidor web para el frontend, configurando automaticamente las redes y volumenes necesarios.
