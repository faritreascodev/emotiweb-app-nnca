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
        const [rows] = await pool.execute(text, params);
        return { rows };
    } catch (error) {
        logger.error('Query error:', error.message);
        throw error;
    }
};

const testConnection = async () => {
    try {
        const [result] = await pool.execute('SELECT 1 + 1 AS result');
        logger.info('✅ MySQL conectado:', result[0].result === 2);
        return true;
    } catch (error) {
        logger.error('❌ Error MySQL:', error.message);
        return false;
    }
};

module.exports = { pool, query, testConnection };
