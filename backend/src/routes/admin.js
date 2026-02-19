const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Obtener estadísticas del dashboard administrativo
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del sistema
 */
router.get('/dashboard', authenticateToken, requireRole('admin'), adminController.getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Obtener todos los usuarios del sistema
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/users', authenticateToken, requireRole('admin'), adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{userId}/toggle:
 *   put:
 *     summary: Activar/desactivar usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activo
 *             properties:
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.put('/users/:userId/toggle', authenticateToken, requireRole('admin'), adminController.toggleUserStatus);
router.post('/users', authenticateToken, requireRole('admin'), adminController.createUser);
router.delete('/users/:userId', authenticateToken, requireRole('admin'), adminController.deleteUser);


/**
 * @swagger
 * /api/admin/health:
 *   get:
 *     summary: Verificar salud del sistema
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado del sistema
 */
router.get('/health', authenticateToken, requireRole('admin'), adminController.getSystemHealth);
router.get('/games', authenticateToken, requireRole('admin'), adminController.getAllGames);
router.put('/games/:id', authenticateToken, requireRole('admin'), adminController.updateGame);


module.exports = router;
