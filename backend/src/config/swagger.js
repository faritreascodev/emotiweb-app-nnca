const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EmotiWeb API',
            version: '1.0.0',
            description: 'API REST para sistema de aprendizaje emocional infantil',
            contact: {
                name: 'PUCE-SE',
                email: 'soporte@emotiweb.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
