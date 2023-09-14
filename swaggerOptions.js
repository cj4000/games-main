const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the version of OpenAPI (formerly Swagger)
    info: {
      title: 'Casino API',
      version: '1.0.0',
      description: 'API documentation for managing casino players and games.',
    },
  },
  apis: ['./routes-swagger/*.js'], // Path to the API route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;