-- ============================================
-- EMOTIWEB DATABASE - SCHEMA & SEEDS (MYSQL)
-- CHARACTER SET: utf8mb4
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Crear tablas
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tipo ENUM('estudiante', 'padre', 'admin') NOT NULL,
    fecha_nacimiento DATE,
    avatar VARCHAR(50) DEFAULT '🐻',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_sesion TIMESTAMP NULL,
    activo BOOLEAN DEFAULT true
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS emociones (
    id VARCHAR(20) PRIMARY KEY,
    nombre_es VARCHAR(50) NOT NULL,
    nombre_en VARCHAR(50) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    color VARCHAR(7) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS emociones_aprendidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    emocion_id VARCHAR(20) NOT NULL,
    veces_identificada_correctamente INTEGER DEFAULT 0,
    veces_identificada_incorrectamente INTEGER DEFAULT 0,
    nivel_dominio DECIMAL(3,2) DEFAULT 0.00,
    ultima_practica TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (emocion_id) REFERENCES emociones(id),
    UNIQUE(usuario_id, emocion_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS situaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    juego_id VARCHAR(50) NOT NULL,
    texto TEXT NOT NULL,
    imagen VARCHAR(50) NOT NULL,
    emocion_correcta VARCHAR(20) NOT NULL,
    nivel_dificultad INTEGER DEFAULT 1,
    activa BOOLEAN DEFAULT true,
    FOREIGN KEY (juego_id) REFERENCES juegos(id),
    FOREIGN KEY (emocion_correcta) REFERENCES emociones(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sesiones_juego (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    juego_id VARCHAR(50) NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    completada BOOLEAN DEFAULT false,
    rondas_jugadas INTEGER DEFAULT 0,
    rondas_correctas INTEGER DEFAULT 0,
    estrellas_ganadas INTEGER DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (juego_id) REFERENCES juegos(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS progreso_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE,
    total_estrellas INTEGER DEFAULT 0,
    total_juegos_jugados INTEGER DEFAULT 0,
    total_respuestas_correctas INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================
-- TRIGGERS: Lógica Automática (Database 1)
-- ============================================

DELIMITER //

-- 1. Crear registro de progreso automáticamente al crear usuario
CREATE TRIGGER tr_crear_progreso_usuario 
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.tipo = 'estudiante' THEN
        INSERT INTO progreso_usuario (usuario_id) VALUES (NEW.id);
    END IF;
END//

-- 2. Actualizar progreso global al finalizar una sesión (Equivalente a reducir stock en ventas)
CREATE TRIGGER tr_actualizar_progreso_al_finalizar_sesion
AFTER UPDATE ON sesiones_juego
FOR EACH ROW
BEGIN
    -- Si la sesión se marca como completada justo ahora
    IF OLD.completada = false AND NEW.completada = true THEN
        UPDATE progreso_usuario 
        SET 
            total_estrellas = total_estrellas + NEW.estrellas_ganadas,
            total_juegos_jugados = total_juegos_jugados + 1,
            total_respuestas_correctas = total_respuestas_correctas + NEW.rondas_correctas,
            ultima_actualizacion = CURRENT_TIMESTAMP
        WHERE usuario_id = NEW.usuario_id;
    END IF;
END//

DELIMITER ;

-- ============================================
-- SEEDS: Emociones
-- ============================================
INSERT IGNORE INTO emociones (id, nombre_es, nombre_en, emoji, color, descripcion, orden) VALUES
('joy', 'Alegría', 'Joy', '😊', '#FFD93D', 'Sentirse contento y feliz', 1),
('sadness', 'Tristeza', 'Sadness', '😢', '#6B9FFF', 'Sentirse triste o desanimado', 2),
('anger', 'Enojo', 'Anger', '😠', '#FF6B6B', 'Sentirse molesto o frustrado', 3),
('fear', 'Miedo', 'Fear', '😨', '#A78BFA', 'Sentirse asustado o preocupado', 4),
('surprise', 'Sorpresa', 'Surprise', '😲', '#FF9F43', 'Sentirse asombrado por algo inesperado', 5);

-- ============================================
-- SEEDS: Juegos
-- ============================================
INSERT IGNORE INTO juegos (id, titulo, descripcion, icono, color, tipo, rondas_por_partida, orden) VALUES
('face-match', 'Caras y Emociones', 'Encuentra la cara correcta para cada emoción', '😊', '#FFD93D', 'face-match', 5, 1),
('situation', '¿Cómo me siento?', 'Identifica la emoción en diferentes situaciones', '🎭', '#4ECDC4', 'situation', 5, 2),
('drag-drop', 'Arrastra y Suelta', 'Une las caras con sus nombres de emociones', '🎯', '#FF6B6B', 'drag-drop', 3, 3),
('story', 'Cuentos Mágicos', 'Sigue la historia e identifica emociones', '📖', '#A78BFA', 'story', 5, 4);

-- ============================================
-- SEEDS: Situaciones
-- ============================================
INSERT IGNORE INTO situaciones (juego_id, texto, imagen, emocion_correcta, nivel_dificultad) VALUES
('situation', 'Tu amigo te regala un juguete nuevo', '🎁', 'joy', 1),
('situation', 'Se rompió tu juguete favorito', '🧸', 'sadness', 1),
('situation', 'Alguien tomó tu comida sin permiso', '🍪', 'anger', 1),
('situation', 'Escuchas un ruido muy fuerte en la noche', '🌙', 'fear', 1),
('situation', 'Ves un arcoíris en el cielo de repente', '🌈', 'surprise', 1),
('situation', 'Tu mamá te da un abrazo grande', '🤗', 'joy', 1),
('situation', 'Tu mascota está perdida', '🐕', 'sadness', 2),
('situation', 'Tu hermano rompió tu dibujo', '🎨', 'anger', 2),
('situation', 'Ves una sombra extraña', '👻', 'fear', 2),
('situation', 'Llega alguien que no esperabas a visitarte', '🚪', 'surprise', 2),
-- Drag-drop situations (Name, Emoji, ID mapping)
('drag-drop', 'ALEGRÍA', '😊', 'joy', 1),
('drag-drop', 'TRISTEZA', '😢', 'sadness', 1),
('drag-drop', 'ENOJO', '😠', 'anger', 1),
('drag-drop', 'MIEDO', '😨', 'fear', 1),
-- Face-match situations
('face-match', 'Alegría', '😊', 'joy', 1),
('face-match', 'Tristeza', '😢', 'sadness', 1),
('face-match', 'Enojo', '😠', 'anger', 1),
('face-match', 'Miedo', '😨', 'fear', 1),
('face-match', 'Sorpresa', '😲', 'surprise', 1);

-- ============================================
-- SEEDS: Usuarios de Prueba (Password: password123)
-- ============================================
INSERT IGNORE INTO usuarios (nombre, email, password_hash, tipo, fecha_nacimiento, avatar) VALUES
('Estudiante Test', 'estudiante@test.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'estudiante', '2020-01-15', '🐻'),
('Padre Test', 'padre@test.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'padre', '1990-05-20', '👨'),
('Admin Test', 'admin@test.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'admin', '1985-03-10', '🎖️');
