const gameRepository = require('../repositories/gameRepository');
const emotionRepository = require('../repositories/emotionRepository');
const ResponseHelper = require('../utils/responseHelper');

class GameController {

    async getAllGames(req, res) {
        try {
            const games = await gameRepository.findAll();
            return ResponseHelper.success(res, games);
        } catch (error) {
            console.error('Error en getAllGames:', error);
            return ResponseHelper.error(res, 'Error al obtener juegos');
        }
    }

    async getGameById(req, res) {
        try {
            const { id } = req.params;
            const game = await gameRepository.findById(id);

            if (!game) {
                return ResponseHelper.notFound(res, 'Juego');
            }

            return ResponseHelper.success(res, game);
        } catch (error) {
            console.error('Error en getGameById:', error);
            return ResponseHelper.error(res, 'Error al obtener juego');
        }
    }

    async getGameQuestions(req, res) {
        try {
            const { id } = req.params;
            const { limit = 10 } = req.query;

            const game = await gameRepository.findById(id);
            if (!game) {
                return ResponseHelper.notFound(res, 'Juego');
            }

            const questions = await gameRepository.getGameQuestions(id, parseInt(limit));

            return ResponseHelper.success(res, {
                juego: game,
                preguntas: questions
            });

        } catch (error) {
            console.error('Error en getGameQuestions:', error);
            return ResponseHelper.error(res, 'Error al obtener preguntas');
        }
    }

    async getAllEmotions(req, res) {
        try {
            const emotions = await emotionRepository.findAll();
            return ResponseHelper.success(res, emotions);
        } catch (error) {
            console.error('Error en getAllEmotions:', error);
            return ResponseHelper.error(res, 'Error al obtener emociones');
        }
    }
}

module.exports = new GameController();
