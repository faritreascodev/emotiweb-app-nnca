-- database/migrations/001_initial_schema.sql

-- ============================================
-- EMOTIWEB DATABASE SCHEMA
-- Proyecto: POO + Bases de Datos 1
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('estudiante', 'padre', 'educador')),
    fecha_nacimiento DATE,
    avatar VARCHAR(50) DEFAULT '🐻',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_sesion TIMESTAMP,
    activo BOOLEAN DEFAULT true
);

-- Índices para optimización
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo);

-- ============================================
-- TABLA: relaciones_familiares
-- ============================================
CREATE TABLE relaciones_familiares (
    id SERIAL PRIMARY KEY,
    padre_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    estudiante_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    relacion VARCHAR(50) DEFAULT 'padre/madre',
    fecha_vinculacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(padre_id, estudiante_id)
);

CREATE INDEX idx_relaciones_padre ON relaciones_familiares(padre_id);
CREATE INDEX idx_relaciones_estudiante ON relaciones_familiares(estudiante_id);

-- ============================================
-- TABLA: emociones
-- ============================================
CREATE TABLE emociones (
    id VARCHAR(20) PRIMARY KEY,
    nombre_es VARCHAR(50) NOT NULL,
    nombre_en VARCHAR(50) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    color VARCHAR(7) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL
);

-- ============================================
-- TABLA: juegos
-- ============================================
CREATE TABLE juegos (
    id VARCHAR(50) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(10) NOT NULL,
    color VARCHAR(7) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('face-match', 'situation', 'drag-drop', 'story')),
    rondas_por_partida INTEGER DEFAULT 5,
    orden INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: preguntas_face_match
-- ============================================
CREATE TABLE preguntas_face_match (
    id SERIAL PRIMARY KEY,
    juego_id VARCHAR(50) NOT NULL REFERENCES juegos(id) ON DELETE CASCADE,
    emocion_correcta VARCHAR(20) NOT NULL REFERENCES emociones(id),
    nivel_dificultad INTEGER DEFAULT 1 CHECK (nivel_dificultad BETWEEN 1 AND 3),
    activa BOOLEAN DEFAULT true
);

-- ============================================
-- TABLA: situaciones
-- ============================================
CREATE TABLE situaciones (
    id SERIAL PRIMARY KEY,
    juego_id VARCHAR(50) NOT NULL REFERENCES juegos(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    imagen VARCHAR(50) NOT NULL,
    emocion_correcta VARCHAR(20) NOT NULL REFERENCES emociones(id),
    nivel_dificultad INTEGER DEFAULT 1 CHECK (nivel_dificultad BETWEEN 1 AND 3),
    activa BOOLEAN DEFAULT true
);

-- ============================================
-- TABLA: historias
-- ============================================
CREATE TABLE historias (
    id SERIAL PRIMARY KEY,
    juego_id VARCHAR(50) NOT NULL REFERENCES juegos(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    orden_presentacion INTEGER DEFAULT 1,
    activa BOOLEAN DEFAULT true
);

-- ============================================
-- TABLA: escenas_historia
-- ============================================
CREATE TABLE escenas_historia (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER NOT NULL REFERENCES historias(id) ON DELETE CASCADE,
    orden INTEGER NOT NULL,
    texto TEXT NOT NULL,
    imagen VARCHAR(100) NOT NULL,
    pregunta TEXT NOT NULL,
    emocion_correcta VARCHAR(20) NOT NULL REFERENCES emociones(id),
    UNIQUE(historia_id, orden)
);

-- ============================================
-- TABLA: opciones_escena
-- ============================================
CREATE TABLE opciones_escena (
    id SERIAL PRIMARY KEY,
    escena_id INTEGER NOT NULL REFERENCES escenas_historia(id) ON DELETE CASCADE,
    emocion VARCHAR(20) NOT NULL REFERENCES emociones(id),
    texto TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT false,
    orden INTEGER NOT NULL
);

-- ============================================
-- TABLA: sesiones_juego
-- ============================================
CREATE TABLE sesiones_juego (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    juego_id VARCHAR(50) NOT NULL REFERENCES juegos(id),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    completada BOOLEAN DEFAULT false,
    rondas_jugadas INTEGER DEFAULT 0,
    rondas_correctas INTEGER DEFAULT 0,
    estrellas_ganadas INTEGER DEFAULT 0,
    tiempo_total_segundos INTEGER
);

CREATE INDEX idx_sesiones_usuario ON sesiones_juego(usuario_id);
CREATE INDEX idx_sesiones_juego ON sesiones_juego(juego_id);
CREATE INDEX idx_sesiones_fecha ON sesiones_juego(fecha_inicio DESC);

-- ============================================
-- TABLA: respuestas
-- ============================================
CREATE TABLE respuestas (
    id SERIAL PRIMARY KEY,
    sesion_id INTEGER NOT NULL REFERENCES sesiones_juego(id) ON DELETE CASCADE,
    numero_ronda INTEGER NOT NULL,
    pregunta_id INTEGER, -- Puede ser NULL dependiendo del tipo de juego
    tipo_pregunta VARCHAR(50) NOT NULL CHECK (tipo_pregunta IN ('face-match', 'situation', 'drag-drop', 'story')),
    emocion_correcta VARCHAR(20) NOT NULL REFERENCES emociones(id),
    emocion_seleccionada VARCHAR(20) REFERENCES emociones(id),
    es_correcta BOOLEAN NOT NULL,
    tiempo_respuesta_segundos INTEGER,
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_respuestas_sesion ON respuestas(sesion_id);

-- ============================================
-- TABLA: progreso_usuario
-- ============================================
CREATE TABLE progreso_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    total_estrellas INTEGER DEFAULT 0,
    total_juegos_jugados INTEGER DEFAULT 0,
    total_respuestas_correctas INTEGER DEFAULT 0,
    racha_actual INTEGER DEFAULT 0,
    mejor_racha INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: emociones_aprendidas
-- ============================================
CREATE TABLE emociones_aprendidas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    emocion_id VARCHAR(20) NOT NULL REFERENCES emociones(id),
    veces_identificada_correctamente INTEGER DEFAULT 0,
    veces_identificada_incorrectamente INTEGER DEFAULT 0,
    fecha_primera_vez TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_vez TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nivel_dominio DECIMAL(3,2) DEFAULT 0.00 CHECK (nivel_dominio BETWEEN 0 AND 1),
    UNIQUE(usuario_id, emocion_id)
);

CREATE INDEX idx_emociones_aprendidas_usuario ON emociones_aprendidas(usuario_id);

-- ============================================
-- TABLA: logros
-- ============================================
CREATE TABLE logros (
    id VARCHAR(50) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(10) NOT NULL,
    condicion_tipo VARCHAR(50) NOT NULL,
    condicion_valor INTEGER NOT NULL,
    puntos INTEGER DEFAULT 0
);

-- ============================================
-- TABLA: logros_usuario
-- ============================================
CREATE TABLE logros_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    logro_id VARCHAR(50) NOT NULL REFERENCES logros(id),
    fecha_obtencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, logro_id)
);

CREATE INDEX idx_logros_usuario ON logros_usuario(usuario_id);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función: Actualizar progreso del usuario automáticamente
CREATE OR REPLACE FUNCTION actualizar_progreso_usuario()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar o actualizar progreso
    INSERT INTO progreso_usuario (usuario_id, total_estrellas, total_juegos_jugados, total_respuestas_correctas)
    VALUES (NEW.usuario_id, NEW.estrellas_ganadas, 1, NEW.rondas_correctas)
    ON CONFLICT (usuario_id) DO UPDATE SET
        total_estrellas = progreso_usuario.total_estrellas + NEW.estrellas_ganadas,
        total_juegos_jugados = progreso_usuario.total_juegos_jugados + 1,
        total_respuestas_correctas = progreso_usuario.total_respuestas_correctas + NEW.rondas_correctas,
        ultima_actualizacion = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Actualizar progreso al finalizar sesión
CREATE TRIGGER trigger_actualizar_progreso
AFTER UPDATE OF completada ON sesiones_juego
FOR EACH ROW
WHEN (NEW.completada = true AND OLD.completada = false)
EXECUTE FUNCTION actualizar_progreso_usuario();

-- Función: Actualizar emociones aprendidas
CREATE OR REPLACE FUNCTION actualizar_emocion_aprendida()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO emociones_aprendidas (usuario_id, emocion_id, veces_identificada_correctamente, veces_identificada_incorrectamente)
    SELECT 
        sj.usuario_id,
        NEW.emocion_correcta,
        CASE WHEN NEW.es_correcta THEN 1 ELSE 0 END,
        CASE WHEN NOT NEW.es_correcta THEN 1 ELSE 0 END
    FROM sesiones_juego sj
    WHERE sj.id = NEW.sesion_id
    ON CONFLICT (usuario_id, emocion_id) DO UPDATE SET
        veces_identificada_correctamente = emociones_aprendidas.veces_identificada_correctamente + 
            CASE WHEN NEW.es_correcta THEN 1 ELSE 0 END,
        veces_identificada_incorrectamente = emociones_aprendidas.veces_identificada_incorrectamente + 
            CASE WHEN NOT NEW.es_correcta THEN 1 ELSE 0 END,
        fecha_ultima_vez = CURRENT_TIMESTAMP,
        nivel_dominio = LEAST(1.0, 
            (emociones_aprendidas.veces_identificada_correctamente + CASE WHEN NEW.es_correcta THEN 1 ELSE 0 END)::DECIMAL / 
            GREATEST(1, emociones_aprendidas.veces_identificada_correctamente + emociones_aprendidas.veces_identificada_incorrectamente + 1)
        );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Actualizar emociones aprendidas al registrar respuesta
CREATE TRIGGER trigger_actualizar_emocion
AFTER INSERT ON respuestas
FOR EACH ROW
EXECUTE FUNCTION actualizar_emocion_aprendida();

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================
COMMENT ON TABLE usuarios IS 'Usuarios del sistema: estudiantes, padres y educadores';
COMMENT ON TABLE sesiones_juego IS 'Registro de cada partida jugada por los usuarios';
COMMENT ON TABLE respuestas IS 'Detalle de cada respuesta dentro de una sesión de juego';
COMMENT ON TABLE progreso_usuario IS 'Resumen del progreso global de cada usuario';
COMMENT ON TABLE emociones_aprendidas IS 'Tracking del dominio de cada emoción por usuario';
