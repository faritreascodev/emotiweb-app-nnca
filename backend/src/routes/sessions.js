const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticateToken } = require('../middleware/auth');
const { Validator, schemas } = require('../middleware/validator');

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Iniciar nueva sesión de juego
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - juegoId
 *             properties:
 *               juegoId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sesión iniciada
 */
router.post('/', authenticateToken, Validator.validate(schemas.startSession), sessionController.startSession);

/**
 * @swagger
 * /api/sessions/user:
 *   get:
 *     summary: Obtener sesiones del usuario autenticado
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sesiones
 */
router.get('/user', authenticateToken, sessionController.getUserSessions);

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Obtener detalles de una sesión
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la sesión
 */
router.get('/:id', authenticateToken, sessionController.getSession);

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Actualizar sesión de juego
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sesión actualizada
 */
router.put('/:id', authenticateToken, sessionController.updateSession);

/**
 * @swagger
 * /api/sessions/{id}/finish:
 *   post:
 *     summary: Finalizar sesión de juego
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sesión finalizada
 */
router.post('/:id/finish', authenticateToken, sessionController.finishSession);

module.exports = router;
