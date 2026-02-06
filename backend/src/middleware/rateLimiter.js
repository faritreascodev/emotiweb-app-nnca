const rateLimit = require('express-rate-limit');

const api = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones, intenta más tarde'
});

module.exports = { api };
