-- database/seeds/001_emotions.sql

-- ============================================
-- SEED: Emociones Básicas
-- ============================================
INSERT INTO emociones (id, nombre_es, nombre_en, emoji, color, descripcion, orden) VALUES
('joy', 'Alegría', 'Joy', '😊', '#FFD93D', 'Sentirse contento y feliz', 1),
('sadness', 'Tristeza', 'Sadness', '😢', '#6B9FFF', 'Sentirse triste o desanimado', 2),
('anger', 'Enojo', 'Anger', '😠', '#FF6B6B', 'Sentirse molesto o frustrado', 3),
('fear', 'Miedo', 'Fear', '😨', '#A78BFA', 'Sentirse asustado o preocupado', 4),
('surprise', 'Sorpresa', 'Surprise', '😲', '#FF9F43', 'Sentirse asombrado por algo inesperado', 5);
