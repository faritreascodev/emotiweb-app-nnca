const progressRepository = require('../repositories/progressRepository');
const achievementRepository = require('../repositories/achievementRepository');
const ResponseHelper = require('../utils/responseHelper');

class ProgressController {

    async getUserProgress(req, res) {
        try {
            const usuarioId = req.user.id;

            const progress = await progressRepository.findByUserId(usuarioId);
            const stats = await progressRepository.getStats(usuarioId);
            const emotionsLearned = await progressRepository.getEmotionsLearned(usuarioId);
            const achievements = await achievementRepository.getUserAchievements(usuarioId);
            const allAchievements = await achievementRepository.findAll();

            return ResponseHelper.success(res, {
                progreso: progress,
                estadisticas: stats,
                emociones: emotionsLearned,
                logros_obtenidos: achievements,
                logros_disponibles: allAchievements
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

    async getAchievements(req, res) {
        try {
            const usuarioId = req.user.id;
            const achievements = await achievementRepository.getUserAchievements(usuarioId);
            const allAchievements = await achievementRepository.findAll();

            return ResponseHelper.success(res, {
                obtenidos: achievements,
                disponibles: allAchievements
            });

        } catch (error) {
            console.error('Error en getAchievements:', error);
            return ResponseHelper.error(res, 'Error al obtener logros');
        }
    }
}

module.exports = new ProgressController();
