const Joi = require('joi');
const ResponseHelper = require('../utils/responseHelper');

class Validator {
    static validate(schema) {
        return (req, res, next) => {
            const { error } = schema.validate(req.body, { abortEarly: false });

            if (error) {
                const errors = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }));

                return ResponseHelper.badRequest(res, 'Errores de validación', errors);
            }

            next();
        };
    }
}

// Schemas de validación
const schemas = {
    register: Joi.object({
        nombre: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        tipo: Joi.string().valid('estudiante', 'padre', 'admin').required(),
        fechaNacimiento: Joi.date().optional(),
        avatar: Joi.string().optional()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    startSession: Joi.object({
        juegoId: Joi.string().valid('face-match', 'situation', 'drag-drop', 'story').required()
    }),

    submitAnswer: Joi.object({
        emocionSeleccionada: Joi.string().valid('joy', 'sadness', 'anger', 'fear', 'surprise').required(),
        emocionCorrecta: Joi.string().valid('joy', 'sadness', 'anger', 'fear', 'surprise').required(),
        esCorrecta: Joi.boolean().required(),
        tiempoRespuesta: Joi.number().integer().min(0).optional()
    })
};

module.exports = { Validator, schemas };
