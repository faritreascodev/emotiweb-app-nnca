const { query } = require('../config/database');

class AnswerRepository {

    async create(sessionId, situacionId, emocionSeleccionada, emocionCorrecta, esCorrecta, tiempoRespuestaMs, numeroRonda) {
        const sql = `
      INSERT INTO respuestas_juego 
        (sesion_id, situacion_id, emocion_seleccionada, emocion_correcta, es_correcta, tiempo_respuesta_ms, numero_ronda)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        const result = await query(sql, [
            sessionId,
            situacionId,
            emocionSeleccionada,
            emocionCorrecta,
            esCorrecta,
            tiempoRespuestaMs,
            numeroRonda
        ]);
        return result.rows.insertId;
    }

    async findBySessionId(sessionId) {
        const sql = `
      SELECT 
        rj.*,
        s.texto as situacion_texto,
        e1.nombre_es as emocion_seleccionada_nombre,
        e2.nombre_es as emocion_correcta_nombre
      FROM respuestas_juego rj
      LEFT JOIN situaciones s ON rj.situacion_id = s.id
      LEFT JOIN emociones e1 ON rj.emocion_seleccionada = e1.id
      LEFT JOIN emociones e2 ON rj.emocion_correcta = e2.id
      WHERE rj.sesion_id = ?
      ORDER BY rj.numero_ronda ASC
    `;
        const result = await query(sql, [sessionId]);
        return result.rows;
    }

    async getSessionStats(sessionId) {
        const sql = `
      SELECT 
        COUNT(*) as total_respuestas,
        SUM(CASE WHEN es_correcta = true THEN 1 ELSE 0 END) as correctas,
        SUM(CASE WHEN es_correcta = false THEN 1 ELSE 0 END) as incorrectas,
        AVG(tiempo_respuesta_ms) as tiempo_promedio_ms
      FROM respuestas_juego
      WHERE sesion_id = ?
    `;
        const result = await query(sql, [sessionId]);
        return result.rows[0];
    }

    async getEmotionAccuracy(usuarioId, emocionId) {
        const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN rj.es_correcta = true THEN 1 ELSE 0 END) as correctas,
        AVG(rj.tiempo_respuesta_ms) as tiempo_promedio
      FROM respuestas_juego rj
      INNER JOIN sesiones_juego sj ON rj.sesion_id = sj.id
      WHERE sj.usuario_id = ? AND rj.emocion_correcta = ?
    `;
        const result = await query(sql, [usuarioId, emocionId]);
        return result.rows[0];
    }
}

module.exports = new AnswerRepository();
