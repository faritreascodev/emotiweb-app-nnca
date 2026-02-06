const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err.message);

  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || 'Error del servidor',
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
