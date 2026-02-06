const { query } = require('../config/database');

class SessionRepository {

    async create(usuarioId, juegoId) {
        const sql = `
      INSERT INTO sesiones_juego (usuario_id, juego_id, fecha_inicio)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      RETURNING *
    `;
        const result = await query(sql, [usuarioId, juegoId]);
        return result.rows[0];
    }

    async findById(id) {
        const sql = 'SELECT * FROM sesiones_juego WHERE id = $1';
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async update(id, updates) {
        const { completada, rondasJugadas, rondasCorrectas, estrellasGanadas } = updates;

        const sql = `
      UPDATE sesiones_juego 
      SET 
        completada = COALESCE($2, completada),
        rondas_jugadas = COALESCE($3, rondas_jugadas),
        rondas_correctas = COALESCE($4, rondas_correctas),
        estrellas_ganadas = COALESCE($5, estrellas_ganadas),
        fecha_fin = CASE WHEN $2 = true THEN CURRENT_TIMESTAMP ELSE fecha_fin END
      WHERE id = $1
      RETURNING *
    `;

        const result = await query(sql, [
            id,
            completada,
            rondasJugadas,
            rondasCorrectas,
            estrellasGanadas
        ]);

        return result.rows[0];
    }

    async findByUserId(usuarioId, limit = 20) {
        const sql = `
      SELECT s.*, j.titulo as juego_titulo
      FROM sesiones_juego s
      INNER JOIN juegos j ON s.juego_id = j.id
      WHERE s.usuario_id = $1
      ORDER BY s.fecha_inicio DESC
      LIMIT $2
    `;
        const result = await query(sql, [usuarioId, limit]);
        return result.rows;
    }
}

module.exports = new SessionRepository();
