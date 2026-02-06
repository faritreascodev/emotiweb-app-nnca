const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const { CORS_ORIGIN } = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(helmet());
app.use(cors({
    origin: CORS_ORIGIN.split(','),
    credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', rateLimiter.api, routes);

app.get('/', (req, res) => {
    res.json({
        name: 'EmotiWeb API',
        version: '1.0.0',
        docs: '/api-docs'
    });
});

app.use(errorHandler);

module.exports = app;
