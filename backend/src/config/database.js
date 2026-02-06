const { Pool } = require('pg');
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = require('./env');
const logger = require('../utils/logger');

const pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

const query = async (text, params = []) => {
    try {
        const result = await pool.query(text, params);
        return result;
    } catch (error) {
        logger.error('Query error:', error.message);
        throw error;
    }
};

const testConnection = async () => {
    try {
        const result = await query('SELECT NOW()');
        logger.info('✅ PostgreSQL conectado:', result.rows[0].now);
        return true;
    } catch (error) {
        logger.error('❌ Error PostgreSQL:', error.message);
        return false;
    }
};

module.exports = { pool, query, testConnection };
