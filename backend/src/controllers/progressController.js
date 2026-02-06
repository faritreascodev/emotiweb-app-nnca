const progressRepository = require('../repositories/progressRepository');
const ResponseHelper = require('../utils/responseHelper');

class ProgressController {

    async getUserProgress(req, res) {
        try {
            const usuarioId = req.user.id;

            const progress = await progressRepository.findByUserId(usuarioId);
            const stats = await progressRepository.getStats(usuarioId);
            const emotionsLearned = await progressRepository.getEmotionsLearned(usuarioId);

            return ResponseHelper.success(res, {
                progreso: progress,
                estadisticas: stats,
                emociones: emotionsLearned
            });

        } catch (error) {
            console.error('Error en getUserProgress:', error);
            return ResponseHelper.error(res, 'Error al obtener progreso');
        }
    }

    async getEmotionsLearned(req, res) {
        try {
            const usuarioId = req.user.id;
            const emotions = await progressRepository.getEmotionsLearned(usuarioId);

            return ResponseHelper.success(res, emotions);

        } catch (error) {
            console.error('Error en getEmotionsLearned:', error);
            return ResponseHelper.error(res, 'Error al obtener emociones aprendidas');
        }
    }

    async getStats(req, res) {
        try {
            const usuarioId = req.user.id;
            const stats = await progressRepository.getStats(usuarioId);

            return ResponseHelper.success(res, stats);

        } catch (error) {
            console.error('Error en getStats:', error);
            return ResponseHelper.error(res, 'Error al obtener estadísticas');
        }
    }
}

module.exports = new ProgressController();
