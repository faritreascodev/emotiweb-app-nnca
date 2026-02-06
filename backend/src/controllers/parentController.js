const progressRepository = require('../repositories/progressRepository');
const sessionRepository = require('../repositories/sessionRepository');
const userRepository = require('../repositories/userRepository');
const ResponseHelper = require('../utils/responseHelper');

class ParentController {

    async getChildProgress(req, res) {
        try {
            const { childId } = req.params;

            if (req.user.tipo !== 'padre' && req.user.tipo !== 'admin') {
                return ResponseHelper.forbidden(res, 'Solo padres y admin pueden ver progreso de estudiantes');
            }

            const child = await userRepository.findById(childId);
            if (!child || child.tipo !== 'estudiante') {
                return ResponseHelper.notFound(res, 'Estudiante');
            }

            const progress = await progressRepository.findByUserId(childId);
            const stats = await progressRepository.getStats(childId);
            const emotionsLearned = await progressRepository.getEmotionsLearned(childId);
            const sessions = await sessionRepository.findByUserId(childId, 10);

            return ResponseHelper.success(res, {
                estudiante: child.toJSON(),
                progreso: progress,
                estadisticas: stats,
                emociones: emotionsLearned,
                sesiones_recientes: sessions
            });

        } catch (error) {
            console.error('Error en getChildProgress:', error);
            return ResponseHelper.error(res, 'Error al obtener progreso del estudiante');
        }
    }

    async getAllStudents(req, res) {
        try {
            if (req.user.tipo !== 'padre' && req.user.tipo !== 'admin') {
                return ResponseHelper.forbidden(res, 'Solo padres y admin pueden ver estudiantes');
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
}

module.exports = new ParentController();
