const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/parent/students:
 *   get:
 *     summary: Obtener todos los estudiantes (solo padres/educadores)
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudiantes con progreso
 */
router.get('/students', authenticateToken, requireRole('padre', 'educador'), parentController.getAllStudents);

/**
 * @swagger
 * /api/parent/child/{childId}:
 *   get:
 *     summary: Obtener progreso detallado de un estudiante
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progreso del estudiante
 */
router.get('/child/:childId', authenticateToken, requireRole('padre', 'educador'), parentController.getChildProgress);

module.exports = router;
