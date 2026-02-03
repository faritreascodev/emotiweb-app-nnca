const { Pool } = require('pg');
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, NODE_ENV } = require('./env');
const logger = require('../utils/logger');

// Configuración del pool
const poolConfig = {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    max: NODE_ENV === 'production' ? 20 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(poolConfig);

// Event listeners
pool.on('connect', (client) => {
    logger.debug('Nueva conexión establecida al pool de PostgreSQL');
});

pool.on('acquire', (client) => {
    logger.debug('Cliente adquirido del pool');
});

pool.on('remove', (client) => {
    logger.debug('Cliente removido del pool');
});

pool.on('error', (err, client) => {
    logger.error('Error inesperado en cliente del pool:', err);
});

// Query helper con logging mejorado
const query = async (text, params = []) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        logger.debug('Query ejecutado', {
            query: text.substring(0, 100),
            params: params.length > 0 ? '***' : 'none',
            duration: `${duration}ms`,
            rows: result.rowCount
        });

        return result;
    } catch (error) {
        logger.error('Error en query:', {
            query: text,
            error: error.message,
            code: error.code
        });
        throw error;
    }
};

// Transacciones con auto-retry
const transaction = async (callback, maxRetries = 3) => {
    let attempt = 0;

    while (attempt < maxRetries) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            attempt++;

            // Retry solo en errores de serialización
            if (error.code === '40001' && attempt < maxRetries) {
                logger.warn(`Reintentando transacción (${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 100 * attempt));
                continue;
            }

            throw error;
        } finally {
            client.release();
        }
    }
};

// Test de conexión con retry
const testConnection = async (maxRetries = 5) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const result = await query('SELECT NOW() as now, current_database() as db');
            logger.info('Conexión a PostgreSQL exitosa', {
                timestamp: result.rows[0].now,
                database: result.rows[0].db
            });
            return true;
        } catch (error) {
            logger.error(`Intento ${i + 1}/${maxRetries} - Error de conexión:`, error.message);

            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
            }
        }
    }

    return false;
};

// Cerrar pool gracefully
const closePool = async () => {
    try {
        await pool.end();
        logger.info('Pool de conexiones cerrado correctamente');
    } catch (error) {
        logger.error('Error al cerrar pool:', error);
    }
};

module.exports = {
    pool,
    query,
    transaction,
    testConnection,
    closePool
};
