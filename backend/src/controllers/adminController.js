const userRepository = require('../repositories/userRepository');
const progressRepository = require('../repositories/progressRepository');
const sessionRepository = require('../repositories/sessionRepository');
const achievementRepository = require('../repositories/achievementRepository');
const { query } = require('../config/database');
const ResponseHelper = require('../utils/responseHelper');

class AdminController {

    async getDashboardStats(req, res) {
        try {
            if (req.user.tipo !== 'admin') {
                return ResponseHelper.forbidden(res, 'Solo administradores pueden acceder');
            }

            // Estadísticas generales
            const statsResult = await query(`
                SELECT 
                    (SELECT COUNT(*) FROM usuarios WHERE tipo = 'estudiante' AND activo = true) as total_estudiantes,
                    (SELECT COUNT(*) FROM usuarios WHERE tipo = 'padre' AND activo = true) as total_padres,
                    (SELECT COUNT(*) FROM sesiones_juego WHERE completada = true) as total_sesiones_completadas,
                    (SELECT SUM(total_estrellas) FROM progreso_usuario) as total_estrellas_sistema,
                    (SELECT COUNT(*) FROM logros_usuario) as total_logros_obtenidos
            `);

            // Juegos más jugados
            const gamesResult = await query(`
                SELECT 
                    j.titulo,
                    j.icono,
                    COUNT(sj.id) as veces_jugado,
                    AVG(sj.rondas_correctas / sj.rondas_jugadas * 100) as precision_promedio
                FROM juegos j
                LEFT JOIN sesiones_juego sj ON j.id = sj.juego_id AND sj.completada = true
                GROUP BY j.id, j.titulo, j.icono
                ORDER BY veces_jugado DESC
            `);

            // Emociones más difíciles
            const emotionsResult = await query(`
                SELECT 
                    e.nombre_es,
                    e.emoji,
                    COUNT(rj.id) as total_respuestas,
                    SUM(CASE WHEN rj.es_correcta = true THEN 1 ELSE 0 END) as correctas,
                    SUM(CASE WHEN rj.es_correcta = false THEN 1 ELSE 0 END) as incorrectas,
                    (SUM(CASE WHEN rj.es_correcta = true THEN 1 ELSE 0 END) / NULLIF(COUNT(rj.id), 0) * 100) as precision_rate
                FROM emociones e
                LEFT JOIN respuestas_juego rj ON e.id = rj.emocion_correcta
                GROUP BY e.id, e.nombre_es, e.emoji
                ORDER BY precision_rate ASC
            `);

            // Actividad reciente
            const recentActivity = await query(`
                SELECT 
                    u.nombre,
                    u.avatar,
                    sj.fecha_fin as fecha,
                    j.titulo as juego,
                    sj.estrellas_ganadas
                FROM sesiones_juego sj
                INNER JOIN usuarios u ON sj.usuario_id = u.id
                INNER JOIN juegos j ON sj.juego_id = j.id
                WHERE sj.completada = true
                ORDER BY sj.fecha_fin DESC
                LIMIT 10
            `);

            return ResponseHelper.success(res, {
                estadisticas: statsResult.rows[0],
                juegos_populares: gamesResult.rows,
                emociones_dificultad: emotionsResult.rows,
                actividad_reciente: recentActivity.rows
            });

        } catch (error) {
            console.error('Error en getDashboardStats:', error);
            return ResponseHelper.error(res, 'Error al obtener estadísticas');
        }
    }

    async getAllUsers(req, res) {
        try {
            if (req.user.tipo !== 'admin') {
                return ResponseHelper.forbidden(res, 'Solo administradores pueden acceder');
            }

            const users = await userRepository.findAll();
            const usersWithStats = await Promise.all(
                users.map(async (user) => {
                    const data = user.toJSON();
                    if (user.tipo === 'estudiante') {
                        const stats = await progressRepository.getStats(user.id);
                        return { ...data, estadisticas: stats };
                    }
                    return data;
                })
            );

            return ResponseHelper.success(res, usersWithStats);
        } catch (error) {
            console.error('Error en getAllUsers:', error);
            return ResponseHelper.error(res, 'Error al obtener usuarios');
        }
    }

    async getUserById(req, res) {
        try {
            if (req.user.tipo !== 'admin') return ResponseHelper.forbidden(res);
            const { userId } = req.params;
            const user = await userRepository.findById(userId);
            if (!user) return ResponseHelper.notFound(res, 'Usuario');

            const data = user.toJSON();
            if (user.tipo === 'estudiante') {
                const stats = await progressRepository.getStats(user.id);
                data.estadisticas = stats;
            }

            return ResponseHelper.success(res, data);
        } catch (error) {
            return ResponseHelper.error(res, 'Error al obtener usuario');
        }
    }

    async updateUser(req, res) {
        try {
            if (req.user.tipo !== 'admin') return ResponseHelper.forbidden(res);
            const { userId } = req.params;
            const { nombre, email, tipo, fechaNacimiento, avatar, activo } = req.body;

            await query(
                'UPDATE usuarios SET nombre = ?, email = ?, tipo = ?, fecha_nacimiento = ?, avatar = ?, activo = ? WHERE id = ?',
                [nombre, email, tipo, fechaNacimiento, avatar, activo, userId]
            );

            return ResponseHelper.success(res, null, 'Usuario actualizado');
        } catch (error) {
            return ResponseHelper.error(res, 'Error al actualizar usuario');
        }
    }

    async createUser(req, res) {
        try {
            if (req.user.tipo !== 'admin') return ResponseHelper.forbidden(res);
            const { nombre, email, password, tipo, fechaNacimiento, avatar } = req.body;
            const user = await userRepository.create(nombre, email, password, tipo, fechaNacimiento, avatar);
            return ResponseHelper.success(res, user.toJSON(), 'Usuario creado', 201);
        } catch (error) {
            return ResponseHelper.error(res, 'Error al crear usuario');
        }
    }

    async deleteUser(req, res) {
        try {
            if (req.user.tipo !== 'admin') return ResponseHelper.forbidden(res);
            const { userId } = req.params;
            await query('DELETE FROM usuarios WHERE id = ?', [userId]);
            return ResponseHelper.success(res, null, 'Usuario eliminado');
        } catch (error) {
            return ResponseHelper.error(res, 'Error al eliminar usuario');
        }
    }

    async getAllGames(req, res) {
        try {
            const games = await query('SELECT * FROM juegos ORDER BY orden');
            return ResponseHelper.success(res, games.rows);
        } catch (error) {
            return ResponseHelper.error(res, 'Error al obtener juegos');
        }
    }

    async updateGame(req, res) {
        try {
            if (req.user.tipo !== 'admin') return ResponseHelper.forbidden(res);
            const { id } = req.params;
            const { titulo, descripcion, icono, color, activo } = req.body;
            await query(
                'UPDATE juegos SET titulo = ?, descripcion = ?, icono = ?, color = ?, activo = ? WHERE id = ?',
                [titulo, descripcion, icono, color, activo, id]
            );
            return ResponseHelper.success(res, null, 'Juego actualizado');
        } catch (error) {
            return ResponseHelper.error(res, 'Error al actualizar juego');
        }
    }

    async getGameById(req, res) {
        try {
            const { id } = req.params;
            const game = await query('SELECT * FROM juegos WHERE id = ?', [id]);
            if (game.rows.length === 0) return ResponseHelper.notFound(res, 'Juego');
            return ResponseHelper.success(res, game.rows[0]);
        } catch (error) {
            return ResponseHelper.error(res, 'Error al obtener juego');
        }
    }

    async createGame(req, res) {
        try {
            if (req.user.tipo !== 'admin') return ResponseHelper.forbidden(res);
            const { id, titulo, descripcion, icono, color, tipo, rondas_por_partida, orden } = req.body;
            await query(
                'INSERT INTO juegos (id, titulo, descripcion, icono, color, tipo, rondas_por_partida, orden) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [id, titulo, descripcion, icono, color, tipo, rondas_por_partida || 5, orden || 0]
            );
            return ResponseHelper.success(res, { id }, 'Juego creado', 201);
        } catch (error) {
            return ResponseHelper.error(res, 'Error al crear juego');
        }
    }

    async deleteGame(req, res) {
        try {
            if (req.user.tipo !== 'admin') return ResponseHelper.forbidden(res);
            const { id } = req.params;
            await query('DELETE FROM juegos WHERE id = ?', [id]);
            return ResponseHelper.success(res, null, 'Juego eliminado');
        } catch (error) {
            return ResponseHelper.error(res, 'Error al eliminar juego');
        }
    }

    async toggleUserStatus(req, res) {
        try {
            if (req.user.tipo !== 'admin') {
                return ResponseHelper.forbidden(res, 'Solo administradores pueden acceder');
            }

            const { userId } = req.params;
            const { activo } = req.body;

            await query('UPDATE usuarios SET activo = ? WHERE id = ?', [activo, userId]);

            return ResponseHelper.success(res, null, 'Estado de usuario actualizado');

        } catch (error) {
            console.error('Error en toggleUserStatus:', error);
            return ResponseHelper.error(res, 'Error al actualizar usuario');
        }
    }

    async getSystemHealth(req, res) {
        try {
            if (req.user.tipo !== 'admin') {
                return ResponseHelper.forbidden(res, 'Solo administradores pueden acceder');
            }

            const dbStatus = await query('SELECT 1 + 1 AS result');

            const health = {
                status: 'healthy',
                database: dbStatus.rows[0].result === 2 ? 'connected' : 'error',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage()
            };

            return ResponseHelper.success(res, health);

        } catch (error) {
            console.error('Error en getSystemHealth:', error);
            return ResponseHelper.error(res, 'Error al verificar salud del sistema');
        }
    }
}

module.exports = new AdminController();
