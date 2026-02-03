-- database/seeds/003_questions.sql

-- ============================================
-- SEED: Situaciones para el juego "Cómo me siento?"
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
('situation', 'Llega alguien que no esperabas a visitarte', '🚪', 'surprise', 2);

-- ============================================
-- SEED: Historia "Luna la Conejita"
-- ============================================
INSERT INTO historias (juego_id, titulo, descripcion, orden_presentacion) VALUES
('story', 'Luna la Conejita', 'Una aventura de emociones con Luna en un día de lluvia', 1);

-- Escenas de la historia
INSERT INTO escenas_historia (historia_id, orden, texto, imagen, pregunta, emocion_correcta) VALUES
(1, 1, 'Era un día soleado. Luna, la conejita, fue al parque a jugar.', '🐰🌳☀️', 'Luna vio a sus amigos esperándola. ¿Cómo se sintió Luna?', 'joy'),
(1, 2, 'Luna estaba jugando cuando empezó a llover muy fuerte.', '🐰🌧️💨', 'Luna no podía seguir jugando. ¿Cómo se sintió?', 'sadness'),
(1, 3, 'De pronto, Luna escuchó un trueno muy fuerte en el cielo.', '🐰⚡🌩️', 'El trueno fue muy ruidoso. ¿Cómo se sintió Luna?', 'fear'),
(1, 4, 'La mamá de Luna llegó con un paraguas grande y colorido.', '🐰🌂❤️', 'Luna no esperaba que su mamá llegara. ¿Cómo se sintió?', 'surprise'),
(1, 5, 'En casa, Luna tomó chocolate caliente con su mamá.', '🐰☕🏠', 'Luna estaba calientita y segura. ¿Cómo se sintió al final?', 'joy');

-- Opciones para cada escena
INSERT INTO opciones_escena (escena_id, emocion, texto, es_correcta, orden) VALUES
-- Escena 1
(1, 'joy', 'Muy feliz de verlos', true, 1),
(1, 'sadness', 'Triste porque no quería jugar', false, 2),
(1, 'fear', 'Asustada de sus amigos', false, 3),
-- Escena 2
(2, 'joy', 'Contenta por la lluvia', false, 1),
(2, 'sadness', 'Triste porque no podía jugar', true, 2),
(2, 'anger', 'Enojada con sus amigos', false, 3),
-- Escena 3
(3, 'joy', 'Feliz por el ruido', false, 1),
(3, 'fear', 'Asustada por el trueno', true, 2),
(3, 'anger', 'Enojada con el cielo', false, 3),
-- Escena 4
(4, 'sadness', 'Triste de ver a su mamá', false, 1),
(4, 'surprise', 'Sorprendida de verla', true, 2),
(4, 'anger', 'Enojada con su mamá', false, 3),
-- Escena 5
(5, 'joy', 'Muy feliz y tranquila', true, 1),
(5, 'fear', 'Asustada en su casa', false, 2),
(5, 'sadness', 'Triste por estar adentro', false, 3);

-- ============================================
-- SEED: Logros
-- ============================================
INSERT INTO logros (id, titulo, descripcion, icono, condicion_tipo, condicion_valor, puntos) VALUES
('primera_estrella', 'Primera Estrella', 'Ganaste tu primera estrella', '⭐', 'estrellas', 1, 10),
('diez_estrellas', '10 Estrellas', 'Acumulaste 10 estrellas', '🌟', 'estrellas', 10, 50),
('cincuenta_estrellas', '50 Estrellas', '¡50 estrellas! Eres increíble', '✨', 'estrellas', 50, 200),
('primer_juego', 'Primer Juego', 'Completaste tu primer juego', '🎮', 'juegos_completados', 1, 10),
('diez_juegos', 'Jugador Activo', 'Completaste 10 juegos', '🏆', 'juegos_completados', 10, 100),
('maestro_emociones', 'Maestro de Emociones', 'Dominaste todas las 5 emociones', '🎓', 'emociones_dominadas', 5, 500);
