const JwtHelper = require('../utils/jwtHelper');
const ResponseHelper = require('../utils/responseHelper');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return ResponseHelper.unauthorized(res, 'Token no proporcionado');
    }

    const decoded = JwtHelper.verifyToken(token);

    if (!decoded) {
        return ResponseHelper.unauthorized(res, 'Token inválido o expirado');
    }

    req.user = decoded;
    next();
};

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return ResponseHelper.unauthorized(res);
        }

        if (!roles.includes(req.user.tipo)) {
            return ResponseHelper.forbidden(res, 'No tienes permisos para esta acción');
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    requireRole
};
