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

-- Tabla para relación Padre-Hijo
CREATE TABLE IF NOT EXISTS relaciones_padre_hijo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    padre_id INTEGER NOT NULL,
    hijo_id INTEGER NOT NULL,
    fecha_vinculacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT true,
    FOREIGN KEY (padre_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (hijo_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(padre_id, hijo_id),
    CHECK (padre_id != hijo_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla para tracking detallado de respuestas
CREATE TABLE IF NOT EXISTS respuestas_juego (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sesion_id INTEGER NOT NULL,
    situacion_id INTEGER NULL,
    emocion_seleccionada VARCHAR(20) NOT NULL,
    emocion_correcta VARCHAR(20) NOT NULL,
    es_correcta BOOLEAN NOT NULL,
    tiempo_respuesta_ms INTEGER,
    numero_ronda INTEGER NOT NULL,
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sesion_id) REFERENCES sesiones_juego(id) ON DELETE CASCADE,
    FOREIGN KEY (situacion_id) REFERENCES situaciones(id),
    FOREIGN KEY (emocion_seleccionada) REFERENCES emociones(id),
    FOREIGN KEY (emocion_correcta) REFERENCES emociones(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla de logros/badges
CREATE TABLE IF NOT EXISTS logros (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(10) NOT NULL,
    color VARCHAR(7) NOT NULL,
    criterio_tipo ENUM('estrellas', 'juegos', 'racha', 'emociones', 'precision') NOT NULL,
    criterio_valor INTEGER NOT NULL,
    orden INTEGER NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla de logros obtenidos por usuarios
CREATE TABLE IF NOT EXISTS logros_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    logro_id VARCHAR(50) NOT NULL,
    fecha_obtencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (logro_id) REFERENCES logros(id),
    UNIQUE(usuario_id, logro_id)
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

-- 3. Actualizar nivel de dominio de emociones al registrar respuesta
CREATE TRIGGER tr_actualizar_emocion_aprendida
AFTER INSERT ON respuestas_juego
FOR EACH ROW
BEGIN
    DECLARE v_usuario_id INT;
    DECLARE v_total_correctas INT;
    DECLARE v_total_incorrectas INT;
    DECLARE v_nuevo_nivel DECIMAL(3,2);
    
    -- Obtener el usuario de la sesión
    SELECT usuario_id INTO v_usuario_id 
    FROM sesiones_juego 
    WHERE id = NEW.sesion_id;
    
    -- Insertar o actualizar el registro de emoción aprendida
    INSERT INTO emociones_aprendidas (usuario_id, emocion_id, veces_identificada_correctamente, veces_identificada_incorrectamente, ultima_practica)
    VALUES (
        v_usuario_id, 
        NEW.emocion_correcta, 
        IF(NEW.es_correcta, 1, 0), 
        IF(NEW.es_correcta, 0, 1),
        CURRENT_TIMESTAMP
    )
    ON DUPLICATE KEY UPDATE
        veces_identificada_correctamente = veces_identificada_correctamente + IF(NEW.es_correcta, 1, 0),
        veces_identificada_incorrectamente = veces_identificada_incorrectamente + IF(NEW.es_correcta, 0, 1),
        ultima_practica = CURRENT_TIMESTAMP;
    
    -- Calcular y actualizar el nivel de dominio
    SELECT 
        veces_identificada_correctamente,
        veces_identificada_incorrectamente
    INTO v_total_correctas, v_total_incorrectas
    FROM emociones_aprendidas
    WHERE usuario_id = v_usuario_id AND emocion_id = NEW.emocion_correcta;
    
    SET v_nuevo_nivel = v_total_correctas / (v_total_correctas + v_total_incorrectas);
    
    UPDATE emociones_aprendidas
    SET nivel_dominio = v_nuevo_nivel
    WHERE usuario_id = v_usuario_id AND emocion_id = NEW.emocion_correcta;
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
('face-match', 'Sorpresa', '😲', 'surprise', 1),
('face-match', 'Vergüenza', '😳', 'sadness', 2),
('face-match', 'Entusiasmo', '🤩', 'joy', 2),
('face-match', 'Preocupación', '😨', 'fear', 2),

-- Story situations
('story', 'Había una vez un osito que invitó a todos sus amigos a una fiesta de cumpleaños en el bosque.', '🎉', 'joy', 1),
('story', 'Pero de repente, empezó a llover muy fuerte y la decoración se arruinó.', '🌧️', 'sadness', 1),
('story', 'Entonces apareció un hada mágica con un paraguas gigante para proteger el pastel.', '✨', 'surprise', 1),
('story', 'Un lobo gruñón intentó robarse los globos de la fiesta.', '🐺', 'anger', 1),
('story', 'Al final, todos bailaron bajo la lluvia y se divirtieron muchísimo.', '💃', 'joy', 1),

-- Story situations: El Tesoro Escondido
('story', 'El pirata Barbanegra encontró un mapa antiguo en una botella.', '📜', 'surprise', 1),
('story', 'Cuando llegó a la isla, vio que alguien ya había cavado y el cofre no estaba.', '🏝️', 'sadness', 1),
('story', 'De pronto, vio a un mono travieso saltando con su collar de oro.', '🐒', 'anger', 1),
('story', 'El mono le devolvió el tesoro y le regaló un plátano mágico.', '🍌', 'joy', 1),
('story', 'El plátano brillaba tanto que iluminaba toda la cueva oscura.', '🔦', 'fear', 1),

-- Story situations: El Robot que no sabía reír
('story', 'Robby era un robot de hojalata que vivía en una ciudad de metal frío.', '🤖', 'sadness', 1),
('story', 'Un día, encontró una pequeña flor de colores creciendo entre las máquinas.', '🌸', 'surprise', 1),
('story', 'Un camión de basura casi pisa la flor y Robby se puso muy firme para protegerla.', '🚛', 'anger', 1),
('story', 'Robby llevó la flor a su casa y le dio agua cada mañana.', '💧', 'joy', 1),
('story', 'Al final, Robby aprendió que los robots también pueden tener un corazón alegre.', '❤️', 'joy', 1),

-- Más situaciones para 'situation'
('situation', 'Te dan una inyección en el médico', '💉', 'fear', 1),
('situation', 'Encuentras un trébol de cuatro hojas', '🍀', 'joy', 1),
('situation', 'Se te perdió el dinero de la merienda', '💸', 'sadness', 2),
('situation', 'Alguien te empuja en la fila del recreo', '🏃', 'anger', 1),
('situation', 'Aparece un dinosaurio gigante en tu jardín', '🦖', 'surprise', 2),

-- More Situations for 'situation'
('situation', 'Encuentras una moneda de oro en el parque', '🪙', 'joy', 2),
('situation', 'Te das cuenta de que no hiciste la tarea para mañana', '📝', 'fear', 2),
('situation', 'Alguien se burla de tus zapatos nuevos', '👟', 'sadness', 2),
('situation', 'Logras armar un rompecabezas muy difícil', '🧩', 'joy', 1),
('situation', 'Ves a un payaso haciendo malabares con fuego', '🔥', 'surprise', 2),
('situation', 'Tu helado se cae al suelo antes del primer bocado', '🍦', 'sadness', 1),
('situation', 'Tu mejor amigo se muda a otra ciudad', '✈️', 'sadness', 3),
('situation', 'Ganas primer lugar en la carrera de la escuela', '🥇', 'joy', 1),
('situation', 'Te pierdes momentáneamente en el centro comercial', '🏬', 'fear', 3),
('situation', 'Recibes una visita sorpresa de tus abuelos', '👵', 'joy', 1);

-- ============================================
-- SEEDS: Usuarios Complementarios (Password: password123)
-- ============================================
INSERT IGNORE INTO usuarios (nombre, email, password_hash, tipo, fecha_nacimiento, avatar) VALUES
('Estudiante Test', 'estudiante@test.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'estudiante', '2020-01-15', '🐻'),
('Padre Test', 'padre@test.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'padre', '1990-05-20', '👨'),
('Admin Test', 'admin@test.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'admin', '1985-03-10', '🎖️'),
('Carlos García', 'carlos.padre@gmail.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'padre', '1988-11-05', '👨‍💼'),
('Mateo García', 'mateo.est@gmail.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'estudiante', '2019-04-12', '🦊'),
('Lucía García', 'lucia.est@gmail.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'estudiante', '2021-08-20', '🐰'),
('Elena López', 'elena.madre@outlook.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'padre', '1992-02-14', '👩‍🏫'),
('Santi López', 'santi.est@outlook.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'estudiante', '2018-12-01', '🦁'),
('Valentina Ramírez', 'val.madre@yahoo.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'padre', '1995-07-25', '👩‍🎨'),
('Emma Ramírez', 'emma.est@yahoo.com', '$2a$10$3AmozOL.5laiPgTLG1FYduKYKJqjLpcYv1Zlyw5i9YoHiEcbTYrIW', 'estudiante', '2022-01-10', '🐱');

-- ============================================
-- SEEDS: Logros/Achievements
-- ============================================
INSERT IGNORE INTO logros (id, nombre, descripcion, icono, color, criterio_tipo, criterio_valor, orden) VALUES
('first_steps', 'Primeros Pasos', 'Completa tu primer juego', '👣', '#4ECDC4', 'juegos', 1, 1),
('star_collector', 'Coleccionista de Estrellas', 'Consigue 10 estrellas', '⭐', '#FFD93D', 'estrellas', 10, 2),
('emotion_explorer', 'Explorador de Emociones', 'Identifica correctamente las 5 emociones', '🎭', '#A78BFA', 'emociones', 5, 3),
('super_star', 'Súper Estrella', 'Consigue 50 estrellas', '🌟', '#FF9F43', 'estrellas', 50, 4),
('emotion_master', 'Maestro de Emociones', 'Domina 3 emociones al 70%', '🏆', '#FFD93D', 'emociones', 3, 5),
('perfect_game', 'Juego Perfecto', 'Completa un juego sin errores', '💯', '#4ECDC4', 'precision', 100, 6),
('dedicated_learner', 'Aprendiz Dedicado', 'Juega 20 partidas', '📚', '#6B9FFF', 'juegos', 20, 7),
('champion', 'Campeón EmotiWeb', 'Consigue 100 estrellas', '👑', '#FF6B6B', 'estrellas', 100, 8);

-- ============================================
-- SEEDS: Vinculaciones Familiares
-- ============================================
INSERT IGNORE INTO relaciones_padre_hijo (padre_id, hijo_id) 
SELECT p.id, h.id FROM usuarios p, usuarios h WHERE p.email = 'carlos.padre@gmail.com' AND h.email IN ('mateo.est@gmail.com', 'lucia.est@gmail.com');

INSERT IGNORE INTO relaciones_padre_hijo (padre_id, hijo_id) 
SELECT p.id, h.id FROM usuarios p, usuarios h WHERE p.email = 'elena.madre@outlook.com' AND h.email = 'santi.est@outlook.com';

INSERT IGNORE INTO relaciones_padre_hijo (padre_id, hijo_id) 
SELECT p.id, h.id FROM usuarios p, usuarios h WHERE p.email = 'val.madre@yahoo.com' AND h.email = 'emma.est@yahoo.com';

-- ============================================
-- SEEDS: Sesiones de Juego (Historial para estadísticas)
-- ============================================
-- Sesiones para Mateo García (Muy aplicado)
INSERT INTO sesiones_juego (usuario_id, juego_id, fecha_inicio, fecha_fin, completada, rondas_jugadas, rondas_correctas, estrellas_ganadas)
SELECT id, 'face-match', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), true, 5, 5, 15 FROM usuarios WHERE email = 'mateo.est@gmail.com';

INSERT INTO sesiones_juego (usuario_id, juego_id, fecha_inicio, fecha_fin, completada, rondas_jugadas, rondas_correctas, estrellas_ganadas)
SELECT id, 'situation', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), true, 5, 4, 12 FROM usuarios WHERE email = 'mateo.est@gmail.com';

-- Sesiones para Santi López
INSERT INTO sesiones_juego (usuario_id, juego_id, fecha_inicio, fecha_fin, completada, rondas_jugadas, rondas_correctas, estrellas_ganadas)
SELECT id, 'drag-drop', DATE_SUB(NOW(), INTERVAL 5 HOUR), NOW(), true, 3, 3, 10 FROM usuarios WHERE email = 'santi.est@outlook.com';

-- ============================================
-- SEEDS: Logros ya obtenidos
-- ============================================
INSERT IGNORE INTO logros_usuario (usuario_id, logro_id)
SELECT u.id, 'first_steps' FROM usuarios u WHERE u.tipo = 'estudiante' AND u.email IN ('mateo.est@gmail.com', 'santi.est@outlook.com');

INSERT IGNORE INTO logros_usuario (usuario_id, logro_id)
SELECT u.id, 'star_collector' FROM usuarios u WHERE u.email = 'mateo.est@gmail.com';

-- ============================================
-- SEEDS: Relación Padre-Hijo (Test Original)
-- ============================================
-- Vincular Padre Test con Estudiante Test
INSERT IGNORE INTO relaciones_padre_hijo (padre_id, hijo_id) 
SELECT p.id, e.id 
FROM usuarios p, usuarios e 
WHERE p.email = 'padre@test.com' AND e.email = 'estudiante@test.com';
