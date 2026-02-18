const progressRepository = require('../repositories/progressRepository');
const sessionRepository = require('../repositories/sessionRepository');
const userRepository = require('../repositories/userRepository');
const relationshipRepository = require('../repositories/relationshipRepository');
const achievementRepository = require('../repositories/achievementRepository');
const ResponseHelper = require('../utils/responseHelper');

class ParentController {

    async getChildProgress(req, res) {
        try {
            const { childId } = req.params;

            if (req.user.tipo !== 'padre' && req.user.tipo !== 'admin') {
                return ResponseHelper.forbidden(res, 'Solo padres y admin pueden ver progreso de estudiantes');
            }

            // Verificar que el padre tiene acceso a este hijo
            const hasAccess = await relationshipRepository.canAccessChild(req.user.id, childId);
            if (!hasAccess) {
                return ResponseHelper.forbidden(res, 'No tienes acceso a este estudiante');
            }

            const child = await userRepository.findById(childId);
            if (!child || child.tipo !== 'estudiante') {
                return ResponseHelper.notFound(res, 'Estudiante');
            }

            const progress = await progressRepository.findByUserId(childId);
            const stats = await progressRepository.getStats(childId);
            const emotionsLearned = await progressRepository.getEmotionsLearned(childId);
            const sessions = await sessionRepository.findByUserId(childId, 10);
            const achievements = await achievementRepository.getUserAchievements(childId);

            return ResponseHelper.success(res, {
                estudiante: child.toJSON(),
                progreso: progress,
                estadisticas: stats,
                emociones: emotionsLearned,
                sesiones_recientes: sessions,
                logros: achievements
            });

        } catch (error) {
            console.error('Error en getChildProgress:', error);
            return ResponseHelper.error(res, 'Error al obtener progreso del estudiante');
        }
    }

    async getMyChildren(req, res) {
        try {
            if (req.user.tipo !== 'padre' && req.user.tipo !== 'admin') {
                return ResponseHelper.forbidden(res, 'Solo padres y admin pueden ver estudiantes');
            }

            let children;

            if (req.user.tipo === 'admin') {
                // Admin ve todos los estudiantes
                const users = await userRepository.findAll();
                children = users.filter(u => u.tipo === 'estudiante');
            } else {
                // Padre ve solo sus hijos vinculados
                children = await relationshipRepository.getChildrenByParentId(req.user.id);
            }

            const childrenWithProgress = await Promise.all(
                children.map(async (child) => {
                    const stats = await progressRepository.getStats(child.id);
                    const achievements = await achievementRepository.getUserAchievements(child.id);
                    return {
                        ...(child.toJSON ? child.toJSON() : child),
                        estadisticas: stats,
                        total_logros: achievements.length
                    };
                })
            );

            return ResponseHelper.success(res, childrenWithProgress);

        } catch (error) {
            console.error('Error en getMyChildren:', error);
            return ResponseHelper.error(res, 'Error al obtener estudiantes');
        }
    }

    async getAllStudents(req, res) {
        try {
            if (req.user.tipo !== 'admin') {
                return ResponseHelper.forbidden(res, 'Solo administradores pueden acceder a la lista global');
            }

            const users = await userRepository.findAll();
            const students = users.filter(u => u.tipo === 'estudiante');

            const studentsWithProgress = await Promise.all(
                students.map(async (student) => {
                    const stats = await progressRepository.getStats(student.id);
                    return {
                        ...student.toJSON(),
                        estadisticas: stats
                    };
                })
            );

            return ResponseHelper.success(res, studentsWithProgress);

        } catch (error) {
            console.error('Error en getAllStudents:', error);
            return ResponseHelper.error(res, 'Error al obtener estudiantes');
        }
    }

    async linkChild(req, res) {
        try {
            const { hijoId } = req.body;

            if (req.user.tipo !== 'padre') {
                return ResponseHelper.forbidden(res, 'Solo padres pueden vincular hijos');
            }

            const child = await userRepository.findById(hijoId);
            if (!child || child.tipo !== 'estudiante') {
                return ResponseHelper.notFound(res, 'Estudiante');
            }

            const relationshipId = await relationshipRepository.createRelationship(req.user.id, hijoId);

            return ResponseHelper.success(res, {
                id: relationshipId,
                padre_id: req.user.id,
                hijo_id: hijoId
            }, 'Hijo vinculado exitosamente', 201);

        } catch (error) {
            console.error('Error en linkChild:', error);
            return ResponseHelper.error(res, 'Error al vincular hijo');
        }
    }

    async unlinkChild(req, res) {
        try {
            const { hijoId } = req.params;

            if (req.user.tipo !== 'padre') {
                return ResponseHelper.forbidden(res, 'Solo padres pueden desvincular hijos');
            }

            await relationshipRepository.removeRelationship(req.user.id, hijoId);

            return ResponseHelper.success(res, null, 'Hijo desvinculado exitosamente');

        } catch (error) {
            console.error('Error en unlinkChild:', error);
            return ResponseHelper.error(res, 'Error al desvincular hijo');
        }
    }

    async registerChild(req, res) {
        try {
            const { nombre, email, password, fechaNacimiento, avatar } = req.body;

            if (req.user.tipo !== 'padre' && req.user.tipo !== 'admin') {
                return ResponseHelper.forbidden(res, 'Solo padres y admin pueden registrar estudiantes');
            }

            // Validar que el email no esté en uso
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                return ResponseHelper.error(res, 'El correo electrónico ya está registrado', 400);
            }

            // Crear el usuario estudiante
            const student = await userRepository.create(
                nombre,
                email,
                password,
                'estudiante',
                fechaNacimiento,
                avatar || '🐻'
            );

            // Si es un padre, vincular automáticamente
            if (req.user.tipo === 'padre') {
                await relationshipRepository.createRelationship(req.user.id, student.id);
            }

            return ResponseHelper.success(res, student, 'Estudiante registrado y vinculado exitosamente', 201);

        } catch (error) {
            console.error('Error en registerChild:', error);
            return ResponseHelper.error(res, 'Error al registrar estudiante');
        }
    }
}

module.exports = new ParentController();

