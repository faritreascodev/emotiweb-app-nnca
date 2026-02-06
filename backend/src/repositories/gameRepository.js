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
        const sql = 'SELECT * FROM juegos WHERE id = $1 AND activo = true';
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async getGameQuestions(gameId, limit = 10) {
        let sql;

        if (gameId === 'situation') {
            sql = `
        SELECT id, texto, imagen, emocion_correcta, nivel_dificultad
        FROM situaciones
        WHERE juego_id = $1 AND activa = true
        ORDER BY RANDOM()
        LIMIT $2
      `;
        } else if (gameId === 'face-match') {
            sql = `
        SELECT DISTINCT emocion_correcta
        FROM emociones
        ORDER BY RANDOM()
        LIMIT $2
      `;
        } else {
            return [];
        }

        const result = await query(sql, [gameId, limit]);
        return result.rows;
    }
}

module.exports = new GameRepository();
