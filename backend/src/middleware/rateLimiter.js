const rateLimit = require('express-rate-limit');

const api = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // Comentado: Aumentado para testing
    message: { success: false, message: 'Demasiadas peticiones, intenta más tarde' }
});

module.exports = { api };
