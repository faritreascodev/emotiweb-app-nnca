const { query } = require('../config/database');

class SessionRepository {

  async create(usuarioId, juegoId) {
    const sql = `
      INSERT INTO sesiones_juego (usuario_id, juego_id, fecha_inicio)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `;
    const result = await query(sql, [usuarioId, juegoId]);
    const id = result.rows.insertId;
    return this.findById(id);
  }

  async findById(id) {
    const sql = 'SELECT * FROM sesiones_juego WHERE id = ?';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  async update(id, updates) {
    const { completada, rondasJugadas, rondasCorrectas, estrellasGanadas } = updates;

    // MySQL doesn't support COALESCE with $n easily in this context without more complex logic, 
    // but since we usually pass all, we can build it. 
    // For simplicity and to match previous behavior:
    const sql = `
      UPDATE sesiones_juego 
      SET 
        completada = IFNULL(?, completada),
        rondas_jugadas = IFNULL(?, rondas_jugadas),
        rondas_correctas = IFNULL(?, rondas_correctas),
        estrellas_ganadas = IFNULL(?, estrellas_ganadas),
        fecha_fin = CASE WHEN ? = true THEN CURRENT_TIMESTAMP ELSE fecha_fin END
      WHERE id = ?
    `;

    await query(sql, [
      completada,
      rondasJugadas,
      rondasCorrectas,
      estrellasGanadas,
      completada,
      id
    ]);

    return this.findById(id);
  }

  async findByUserId(usuarioId, limit = 20) {
    const sql = `
      SELECT s.*, j.titulo as juego_titulo
      FROM sesiones_juego s
      INNER JOIN juegos j ON s.juego_id = j.id
      WHERE s.usuario_id = ?
      ORDER BY s.fecha_inicio DESC
      LIMIT ?
    `;
    const result = await query(sql, [usuarioId, parseInt(limit)]);
    return result.rows;
  }
}

module.exports = new SessionRepository();
