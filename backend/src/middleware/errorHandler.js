const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');
const { NODE_ENV } = require('../config/env');

// Clases de error personalizadas
class AppError extends Error {
    constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, StatusCodes.BAD_REQUEST);
        this.errors = errors;
    }
}

class NotFoundError extends AppError {
    constructor(resource = 'Recurso') {
        super(`${resource} no encontrado`, StatusCodes.NOT_FOUND);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'No autorizado') {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Acceso denegado') {
        super(message, StatusCodes.FORBIDDEN);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflicto con el estado actual') {
        super(message, StatusCodes.CONFLICT);
    }
}

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    // Log del error
    if (error.statusCode >= 500) {
        logger.error('Server Error:', {
            message: error.message,
            stack: err.stack,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip
        });
    } else {
        logger.warn('Client Error:', {
            message: error.message,
            url: req.originalUrl,
            method: req.method
        });
    }

    // Errores específicos de PostgreSQL
    if (err.code === '23505') {
        error = new ConflictError('El registro ya existe');
    }

    if (err.code === '23503') {
        error = new ValidationError('Referencia inválida a registro relacionado');
    }

    if (err.code === '22P02') {
        error = new ValidationError('Formato de dato inválido');
    }

    // Errores de validación Joi
    if (err.name === 'ValidationError' && err.isJoi) {
        error = new ValidationError('Error de validación', err.details);
    }

    // Errores JWT
    if (err.name === 'JsonWebTokenError') {
        error = new UnauthorizedError('Token inválido');
    }

    if (err.name === 'TokenExpiredError') {
        error = new UnauthorizedError('Token expirado');
    }

    // Respuesta
    const response = {
        success: false,
        message: error.message,
        statusCode: error.statusCode,
        timestamp: error.timestamp || new Date().toISOString()
    };

    // Agregar detalles solo en desarrollo
    if (NODE_ENV === 'development') {
        response.stack = err.stack;
        if (error.errors) response.errors = error.errors;
    }

    res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
module.exports.AppError = AppError;
module.exports.ValidationError = ValidationError;
module.exports.NotFoundError = NotFoundError;
module.exports.UnauthorizedError = UnauthorizedError;
module.exports.ForbiddenError = ForbiddenError;
module.exports.ConflictError = ConflictError;
