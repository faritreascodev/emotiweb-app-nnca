const { query } = require('../config/database');

class AchievementRepository {

    async findAll() {
        const sql = 'SELECT * FROM logros ORDER BY orden ASC';
        const result = await query(sql);
        return result.rows;
    }

    async findById(id) {
        const sql = 'SELECT * FROM logros WHERE id = ?';
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async getUserAchievements(usuarioId) {
        const sql = `
      SELECT 
        l.*,
        lu.fecha_obtencion,
        lu.id as logro_usuario_id
      FROM logros l
      INNER JOIN logros_usuario lu ON l.id = lu.logro_id
      WHERE lu.usuario_id = ?
      ORDER BY lu.fecha_obtencion DESC
    `;
        const result = await query(sql, [usuarioId]);
        return result.rows;
    }

    async grantAchievement(usuarioId, logroId) {
        try {
            const sql = `
        INSERT INTO logros_usuario (usuario_id, logro_id)
        VALUES (?, ?)
      `;
            await query(sql, [usuarioId, logroId]);
            return true;
        } catch (error) {
            // Si ya existe (UNIQUE constraint), no es error
            if (error.code === 'ER_DUP_ENTRY') {
                return false;
            }
            throw error;
        }
    }

    async checkAndGrantAchievements(usuarioId) {
        const newAchievements = [];

        // Obtener estadísticas del usuario
        const statsResult = await query(`
      SELECT 
        IFNULL(p.total_estrellas, 0) as total_estrellas,
        IFNULL(p.total_juegos_jugados, 0) as total_juegos_jugados,
        IFNULL(p.total_respuestas_correctas, 0) as total_respuestas_correctas,
        (
          SELECT COUNT(DISTINCT ea.emocion_id)
          FROM emociones_aprendidas ea
          WHERE ea.usuario_id = ? AND ea.nivel_dominio >= 0.7
        ) as emociones_dominadas,
        (
          SELECT COUNT(DISTINCT ea.emocion_id)
          FROM emociones_aprendidas ea
          WHERE ea.usuario_id = ? AND ea.veces_identificada_correctamente > 0
        ) as emociones_identificadas
      FROM usuarios u
      LEFT JOIN progreso_usuario p ON u.id = p.usuario_id
      WHERE u.id = ?
    `, [usuarioId, usuarioId, usuarioId]);

        const stats = statsResult.rows[0];

        // Obtener logros disponibles
        const logrosResult = await query('SELECT * FROM logros');
        const logros = logrosResult.rows;

        // Verificar cada logro
        for (const logro of logros) {
            let cumple = false;

            switch (logro.criterio_tipo) {
                case 'estrellas':
                    cumple = stats.total_estrellas >= logro.criterio_valor;
                    break;
                case 'juegos':
                    cumple = stats.total_juegos_jugados >= logro.criterio_valor;
                    break;
                case 'emociones':
                    cumple = stats.emociones_dominadas >= logro.criterio_valor;
                    break;
                case 'precision':
                    // Verificar si tiene algún juego perfecto
                    const perfectGameResult = await query(`
            SELECT COUNT(*) as count
            FROM sesiones_juego
            WHERE usuario_id = ? 
              AND completada = true 
              AND rondas_jugadas > 0
              AND rondas_correctas = rondas_jugadas
          `, [usuarioId]);
                    cumple = perfectGameResult.rows[0].count > 0;
                    break;
            }

            if (cumple) {
                const granted = await this.grantAchievement(usuarioId, logro.id);
                if (granted) {
                    newAchievements.push(logro);
                }
            }
        }

        return newAchievements;
    }
}

module.exports = new AchievementRepository();
