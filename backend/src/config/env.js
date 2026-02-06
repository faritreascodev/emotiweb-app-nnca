require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_NAME: process.env.DB_NAME || 'emotiweb_db',
    DB_USER: process.env.DB_USER || 'emotiweb_user',
    DB_PASSWORD: process.env.DB_PASSWORD || 'emotiweb_pass_2026',

    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret',

    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};
