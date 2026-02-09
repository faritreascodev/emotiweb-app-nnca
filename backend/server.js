require('dotenv').config();
const app = require('./src/app');
const { PORT } = require('./src/config/env');
const { testConnection } = require('./src/config/database');
const logger = require('./src/utils/logger');

const startServer = async () => {
    try {
        const dbConnected = await testConnection();
        if (!dbConnected) {
            throw new Error('No se pudo conectar a MySQL');
        }

        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`🚀 EmotiWeb API corriendo en puerto ${PORT}`);
            logger.info(`📚 Docs: http://localhost:${PORT}/api-docs`);
            logger.info(`🏥 Health: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        logger.error('Error fatal:', error);
        process.exit(1);
    }
};

startServer();
