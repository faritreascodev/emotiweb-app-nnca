-- ============================================
-- EMOTIWEB DATABASE - SCHEMA & SEEDS
-- ============================================

-- Habilitar extensión para encriptación
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crear tablas
CREATE TABLE IF NOT EXISTS usuarios (
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

CREATE TABLE IF NOT EXISTS emociones (
    id VARCHAR(20) PRIMARY KEY,
    nombre_es VARCHAR(50) NOT NULL,
    nombre_en VARCHAR(50) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    color VARCHAR(7) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS emociones_aprendidas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    emocion_id VARCHAR(20) NOT NULL REFERENCES emociones(id),
    veces_identificada_correctamente INTEGER DEFAULT 0,
    veces_identificada_incorrectamente INTEGER DEFAULT 0,
    nivel_dominio DECIMAL(3,2) DEFAULT 0.00,
    ultima_practica TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, emocion_id)
);

CREATE TABLE IF NOT EXISTS juegos (
    id VARCHAR(50) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(10) NOT NULL,
    color VARCHAR(7) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    rondas_por_partida INTEGER DEFAULT 5,
    orden INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS situaciones (
    id SERIAL PRIMARY KEY,
    juego_id VARCHAR(50) NOT NULL REFERENCES juegos(id),
    texto TEXT NOT NULL,
    imagen VARCHAR(50) NOT NULL,
    emocion_correcta VARCHAR(20) NOT NULL REFERENCES emociones(id),
    nivel_dificultad INTEGER DEFAULT 1,
    activa BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS sesiones_juego (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    juego_id VARCHAR(50) NOT NULL REFERENCES juegos(id),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    completada BOOLEAN DEFAULT false,
    rondas_jugadas INTEGER DEFAULT 0,
    rondas_correctas INTEGER DEFAULT 0,
    estrellas_ganadas INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS progreso_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    total_estrellas INTEGER DEFAULT 0,
    total_juegos_jugados INTEGER DEFAULT 0,
    total_respuestas_correctas INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SEEDS: Emociones
-- ============================================
INSERT INTO emociones (id, nombre_es, nombre_en, emoji, color, descripcion, orden) VALUES
('joy', 'Alegría', 'Joy', '😊', '#FFD93D', 'Sentirse contento y feliz', 1),
('sadness', 'Tristeza', 'Sadness', '😢', '#6B9FFF', 'Sentirse triste o desanimado', 2),
('anger', 'Enojo', 'Anger', '😠', '#FF6B6B', 'Sentirse molesto o frustrado', 3),
('fear', 'Miedo', 'Fear', '😨', '#A78BFA', 'Sentirse asustado o preocupado', 4),
('surprise', 'Sorpresa', 'Surprise', '😲', '#FF9F43', 'Sentirse asombrado por algo inesperado', 5)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEEDS: Juegos
-- ============================================
INSERT INTO juegos (id, titulo, descripcion, icono, color, tipo, rondas_por_partida, orden) VALUES
('face-match', 'Caras y Emociones', 'Encuentra la cara correcta para cada emoción', '😊', '#FFD93D', 'face-match', 5, 1),
('situation', 'Cómo me siento?', 'Identifica la emoción en diferentes situaciones', '🎭', '#4ECDC4', 'situation', 5, 2),
('drag-drop', 'Arrastra y Suelta', 'Une las caras con sus nombres de emociones', '🎯', '#FF6B6B', 'drag-drop', 3, 3),
('story', 'Cuentos Mágicos', 'Sigue la historia e identifica emociones', '📖', '#A78BFA', 'story', 5, 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEEDS: Situaciones
-- ============================================
INSERT INTO situaciones (juego_id, texto, imagen, emocion_correcta, nivel_dificultad) VALUES
('situation', 'Tu amigo te regala un juguete nuevo', '🎁', 'joy', 1),
('situation', 'Se rompió tu juguete favorito', '🧸', 'sadness', 1),
('situation', 'Alguien tomó tu comida sin permiso', '🍪', 'anger', 1),
('situation', 'Escuchas un ruido muy fuerte en la noche', '🌙', 'fear', 1),
('situation', 'Ves un arcoíris en el cielo de repente', '🌈', 'surprise', 1),
('situation', 'Tu mamá te da un abrazo grande', '🤗', 'joy', 1),
('situation', 'Tu mascota está perdida', '🐕', 'sadness', 2),
('situation', 'Tu hermano rompió tu dibujo', '🎨', 'anger', 2),
('situation', 'Ves una sombra extraña', '👻', 'fear', 2),
('situation', 'Llega alguien que no esperabas a visitarte', '🚪', 'surprise', 2)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEEDS: Usuarios de Prueba
-- ============================================
-- Password: password123
-- Usamos crypt con bcrypt (necesita extension pgcrypto)
INSERT INTO usuarios (nombre, email, password_hash, tipo, fecha_nacimiento, avatar) VALUES
('Estudiante Test', 'estudiante@test.com', crypt('password123', gen_salt('bf', 10)), 'estudiante', '2020-01-15', '🐻'),
('Padre Test', 'padre@test.com', crypt('password123', gen_salt('bf', 10)), 'padre', '1990-05-20', '👨‍👩‍👧'),
('Educador Test', 'educador@test.com', crypt('password123', gen_salt('bf', 10)), 'educador', '1985-03-10', '👨‍🏫')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Verificación
-- ============================================
SELECT 'Database initialized successfully!' as status;
SELECT COUNT(*) as total_emociones FROM emociones;
SELECT COUNT(*) as total_juegos FROM juegos;
SELECT COUNT(*) as total_situaciones FROM situaciones;
SELECT COUNT(*) as total_usuarios FROM usuarios;
