const winston = require('winston');
const { NODE_ENV } = require('../config/env');

// Definir niveles de log personalizados
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// Colores para consola
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
};

winston.addColors(colors);

// Formato para desarrollo
const devFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

// Formato para producción (JSON estructurado)
const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Transports
const transports = [
    new winston.transports.Console({
        format: NODE_ENV === 'development' ? devFormat : prodFormat
    }),

    // Archivo para errores
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }),

    // Archivo para todos los logs
    new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880,
        maxFiles: 5
    })
];

// Crear logger
const logger = winston.createLogger({
    level: NODE_ENV === 'development' ? 'debug' : 'info',
    levels,
    transports,
    exitOnError: false
});

module.exports = logger;
