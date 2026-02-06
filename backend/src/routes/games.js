const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Obtener todos los juegos
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de juegos
 */
router.get('/', authenticateToken, gameController.getAllGames);

/**
 * @swagger
 * /api/games/emotions:
 *   get:
 *     summary: Obtener todas las emociones
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de emociones
 */
router.get('/emotions', authenticateToken, gameController.getAllEmotions);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Obtener detalles de un juego
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del juego
 */
router.get('/:id', authenticateToken, gameController.getGameById);

/**
 * @swagger
 * /api/games/{id}/questions:
 *   get:
 *     summary: Obtener preguntas de un juego
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Preguntas del juego
 */
router.get('/:id/questions', authenticateToken, gameController.getGameQuestions);

module.exports = router;
