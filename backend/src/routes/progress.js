const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/progress:
 *   get:
 *     summary: Obtener progreso del usuario autenticado
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progreso del usuario
 */
router.get('/', authenticateToken, progressController.getUserProgress);

/**
 * @swagger
 * /api/progress/emotions:
 *   get:
 *     summary: Obtener emociones aprendidas
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Emociones aprendidas
 */
router.get('/emotions', authenticateToken, progressController.getEmotionsLearned);

/**
 * @swagger
 * /api/progress/stats:
 *   get:
 *     summary: Obtener estadísticas del usuario
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del usuario
 */
router.get('/stats', authenticateToken, progressController.getStats);

module.exports = router;
