const { query } = require('../config/database');

class ProgressRepository {

    async findByUserId(usuarioId) {
        const sql = `
      SELECT * FROM progreso_usuario WHERE usuario_id = $1
    `;
        const result = await query(sql, [usuarioId]);
        return result.rows[0] || null;
    }

    async getEmotionsLearned(usuarioId) {
        const sql = `
      SELECT 
        e.id,
        e.nombre_es,
        e.emoji,
        e.color,
        COALESCE(ea.veces_identificada_correctamente, 0) as veces_correcta,
        COALESCE(ea.veces_identificada_incorrectamente, 0) as veces_incorrecta,
        COALESCE(ea.nivel_dominio, 0) as nivel_dominio
      FROM emociones e
      LEFT JOIN emociones_aprendidas ea ON e.id = ea.emocion_id AND ea.usuario_id = $1
      ORDER BY e.orden
    `;
        const result = await query(sql, [usuarioId]);
        return result.rows;
    }

    async getStats(usuarioId) {
        const sql = `
      SELECT 
        COALESCE(p.total_estrellas, 0) as total_estrellas,
        COALESCE(p.total_juegos_jugados, 0) as total_juegos_jugados,
        COALESCE(p.total_respuestas_correctas, 0) as total_respuestas_correctas,
        COUNT(DISTINCT sj.id) as sesiones_completadas,
        (
          SELECT COUNT(*) 
          FROM emociones_aprendidas ea 
          WHERE ea.usuario_id = $1 AND ea.nivel_dominio >= 0.7
        ) as emociones_dominadas
      FROM usuarios u
      LEFT JOIN progreso_usuario p ON u.id = p.usuario_id
      LEFT JOIN sesiones_juego sj ON u.id = sj.usuario_id AND sj.completada = true
      WHERE u.id = $1
      GROUP BY u.id, p.total_estrellas, p.total_juegos_jugados, p.total_respuestas_correctas
    `;
        const result = await query(sql, [usuarioId]);
        return result.rows[0];
    }
}

module.exports = new ProgressRepository();
