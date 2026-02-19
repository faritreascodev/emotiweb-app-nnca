const mysql = require('mysql2/promise');
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = require('./env');
const logger = require('../utils/logger');

const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const query = async (text, params = []) => {
    try {
        // MySQL uses ? instead of $1, $2
        const [rows] = await pool.query(text, params);
        return { rows };
    } catch (error) {
        logger.error('Query error:', error.message);
        throw error;
    }
};

const testConnection = async (retries = 10, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
        try {
            logger.info(`[Intento ${i + 1}/${retries}] Conectando a MySQL en ${DB_HOST}:${DB_PORT}...`);
            const [result] = await pool.execute('SELECT 1 + 1 AS result');
            if (result[0].result === 2) {
                logger.info('✅ MySQL conectado y respondiendo correctamente');
                return true;
            }
        } catch (error) {
            logger.error(`❌ Error de conexión (Intento ${i + 1}): ${error.message}`);
            if (i < retries - 1) {
                logger.info(`Reintentando en ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    return false;
};

module.exports = { pool, query, testConnection };
