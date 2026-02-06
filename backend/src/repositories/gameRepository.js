const { query } = require('../config/database');

class GameRepository {

    async findAll() {
        const sql = `
      SELECT * FROM juegos 
      WHERE activo = true 
      ORDER BY orden ASC
    `;
        const result = await query(sql);
        return result.rows;
    }

    async findById(id) {
        const sql = 'SELECT * FROM juegos WHERE id = ? AND activo = true';
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async getGameQuestions(gameId, limit = 10) {
        let sql;
        let params = [gameId, parseInt(limit)];

        if (gameId === 'situation') {
            sql = `
        SELECT id, texto, imagen, emocion_correcta, nivel_dificultad
        FROM situaciones
        WHERE juego_id = ? AND activa = true
        ORDER BY RAND()
        LIMIT ?
      `;
        } else if (gameId === 'face-match') {
            // For face-match, we want different emotions to match
            sql = `
        SELECT id, nombre_es as texto, emoji as imagen, id as emocion_correcta
        FROM emociones
        ORDER BY RAND()
        LIMIT ?
      `;
            params = [parseInt(limit)];
        } else {
            return [];
        }

        const result = await query(sql, params);
        return result.rows;
    }
}

module.exports = new GameRepository();
