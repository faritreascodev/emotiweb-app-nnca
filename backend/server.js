require('dotenv').config();
const app = require('./src/app');
const { PORT } = require('./src/config/env');
const { testConnection } = require('./src/config/database');
const logger = require('./src/utils/logger');

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Iniciar servidor
const startServer = async () => {
    try {
        // Test de conexión a base de datos
        const dbConnected = await testConnection();
        if (!dbConnected) {
            throw new Error('No se pudo conectar a la base de datos');
        }

        // Iniciar servidor HTTP
        const server = app.listen(PORT, () => {
            logger.info(`Servidor EmotiWeb API corriendo en puerto ${PORT}`);
            logger.info(`Documentación disponible en http://localhost:${PORT}/api-docs`);
            logger.info(`Health check en http://localhost:${PORT}/health`);
        });

        // Graceful shutdown
        const gracefulShutdown = () => {
            logger.info('Señal de apagado recibida, cerrando servidor...');
            server.close(() => {
                logger.info('Servidor cerrado correctamente');
                process.exit(0);
            });

            // Forzar cierre después de 10 segundos
            setTimeout(() => {
                logger.error('Forzando cierre del servidor');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        logger.error('Error al iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();
