const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/parent/students:
 *   get:
 *     summary: Obtener todos los estudiantes (solo padres/admin)
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudiantes con progreso
 */
router.get('/students', authenticateToken, requireRole('padre', 'admin'), parentController.getAllStudents);

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
router.get('/child/:childId', authenticateToken, requireRole('padre', 'admin'), parentController.getChildProgress);

/**
 * @swagger
 * /api/parent/my-children:
 *   get:
 *     summary: Obtener mis hijos vinculados (padres) o todos los estudiantes (admin)
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de hijos con progreso
 */
router.get('/my-children', authenticateToken, requireRole('padre', 'admin'), parentController.getMyChildren);

/**
 * @swagger
 * /api/parent/link-child:
 *   post:
 *     summary: Vincular un hijo (solo padres)
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hijoId
 *             properties:
 *               hijoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Hijo vinculado exitosamente
 */
router.post('/link-child', authenticateToken, requireRole('padre'), parentController.linkChild);

/**
 * @swagger
 * /api/parent/unlink-child/{hijoId}:
 *   delete:
 *     summary: Desvincular un hijo (solo padres)
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hijoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Hijo desvinculado exitosamente
 */
router.delete('/unlink-child/:hijoId', authenticateToken, requireRole('padre'), parentController.unlinkChild);

/**
 * @swagger
 * /api/parent/register-child:
 *   post:
 *     summary: Registrar un nuevo hijo directamente (solo padres/admin)
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *               avatar:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estudiante registrado exitosamente
 */
router.post('/register-child', authenticateToken, requireRole('padre', 'admin'), parentController.registerChild);

module.exports = router;
