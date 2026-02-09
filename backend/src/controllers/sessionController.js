const sessionRepository = require('../repositories/sessionRepository');
const gameRepository = require('../repositories/gameRepository');
const answerRepository = require('../repositories/answerRepository');
const achievementRepository = require('../repositories/achievementRepository');
const ResponseHelper = require('../utils/responseHelper');

class SessionController {

    async startSession(req, res) {
        try {
            const { juegoId } = req.body;
            const usuarioId = req.user.id;

            const game = await gameRepository.findById(juegoId);
            if (!game) {
                return ResponseHelper.notFound(res, 'Juego');
            }

            const session = await sessionRepository.create(usuarioId, juegoId);

            return ResponseHelper.success(res, session, 'Sesión iniciada', 201);

        } catch (error) {
            console.error('Error en startSession:', error);
            return ResponseHelper.error(res, 'Error al iniciar sesión de juego');
        }
    }

    async getSession(req, res) {
        try {
            const { id } = req.params;
            const session = await sessionRepository.findById(id);

            if (!session) {
                return ResponseHelper.notFound(res, 'Sesión');
            }

            if (session.usuario_id !== req.user.id) {
                return ResponseHelper.forbidden(res, 'No tienes acceso a esta sesión');
            }

            // Incluir respuestas si están disponibles
            const answers = await answerRepository.findBySessionId(id);
            const stats = await answerRepository.getSessionStats(id);

            return ResponseHelper.success(res, {
                ...session,
                respuestas: answers,
                estadisticas: stats
            });

        } catch (error) {
            console.error('Error en getSession:', error);
            return ResponseHelper.error(res, 'Error al obtener sesión');
        }
    }

    async updateSession(req, res) {
        try {
            const { id } = req.params;
            const { rondasJugadas, rondasCorrectas, estrellasGanadas, completada } = req.body;

            const session = await sessionRepository.findById(id);
            if (!session) {
                return ResponseHelper.notFound(res, 'Sesión');
            }

            if (session.usuario_id !== req.user.id) {
                return ResponseHelper.forbidden(res, 'No tienes acceso a esta sesión');
            }

            const updated = await sessionRepository.update(id, {
                rondasJugadas,
                rondasCorrectas,
                estrellasGanadas,
                completada
            });

            return ResponseHelper.success(res, updated, 'Sesión actualizada');

        } catch (error) {
            console.error('Error en updateSession:', error);
            return ResponseHelper.error(res, 'Error al actualizar sesión');
        }
    }

    async getUserSessions(req, res) {
        try {
            const usuarioId = req.user.id;
            const { limit = 20 } = req.query;

            const sessions = await sessionRepository.findByUserId(usuarioId, parseInt(limit));

            return ResponseHelper.success(res, sessions);

        } catch (error) {
            console.error('Error en getUserSessions:', error);
            return ResponseHelper.error(res, 'Error al obtener sesiones');
        }
    }

    async recordAnswer(req, res) {
        try {
            const { id } = req.params;
            const { situacionId, emocionSeleccionada, emocionCorrecta, tiempoRespuesta, numeroRonda } = req.body;

            const session = await sessionRepository.findById(id);
            if (!session) {
                return ResponseHelper.notFound(res, 'Sesión');
            }

            if (session.usuario_id !== req.user.id) {
                return ResponseHelper.forbidden(res, 'No tienes acceso a esta sesión');
            }

            const esCorrecta = emocionSeleccionada === emocionCorrecta;

            await answerRepository.create(
                id,
                situacionId,
                emocionSeleccionada,
                emocionCorrecta,
                esCorrecta,
                tiempoRespuesta,
                numeroRonda
            );

            return ResponseHelper.success(res, {
                es_correcta: esCorrecta
            }, 'Respuesta registrada');

        } catch (error) {
            console.error('Error en recordAnswer:', error);
            return ResponseHelper.error(res, 'Error al registrar respuesta');
        }
    }

    async finishSession(req, res) {
        try {
            const { id } = req.params;
            const { rondasJugadas, rondasCorrectas } = req.body;

            const session = await sessionRepository.findById(id);
            if (!session) {
                return ResponseHelper.notFound(res, 'Sesión');
            }

            if (session.usuario_id !== req.user.id) {
                return ResponseHelper.forbidden(res, 'No tienes acceso a esta sesión');
            }

            const estrellasGanadas = rondasCorrectas;

            const updated = await sessionRepository.update(id, {
                rondasJugadas,
                rondasCorrectas,
                estrellasGanadas,
                completada: true
            });

            // Verificar y otorgar logros
            const newAchievements = await achievementRepository.checkAndGrantAchievements(req.user.id);

            return ResponseHelper.success(res, {
                sesion: updated,
                nuevos_logros: newAchievements
            }, 'Sesión finalizada');

        } catch (error) {
            console.error('Error en finishSession:', error);
            return ResponseHelper.error(res, 'Error al finalizar sesión');
        }
    }
}

module.exports = new SessionController();

