class ResponseHelper {
    static success(res, data, message = 'Operación exitosa', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    static error(res, message = 'Error del servidor', statusCode = 500, errors = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    static notFound(res, resource = 'Recurso') {
        return this.error(res, `${resource} no encontrado`, 404);
    }

    static unauthorized(res, message = 'No autorizado') {
        return this.error(res, message, 401);
    }

    static forbidden(res, message = 'Acceso denegado') {
        return this.error(res, message, 403);
    }

    static badRequest(res, message = 'Solicitud inválida', errors = null) {
        return this.error(res, message, 400, errors);
    }
}

module.exports = ResponseHelper;
