const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Atlantis Logistic ERP API',
      version: '1.0.0',
      description: 'API dokumentacija za Atlantis Logistic ERP sistem',
      contact: {
        name: 'Kosta',
        email: 'info@atlantislogistic.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Vehicles',
        description: 'Vehicle management endpoints'
      },
      {
        name: 'Clients',
        description: 'Client management endpoints'
      },
      {
        name: 'Employees',
        description: 'Employee management endpoints'
      },
      {
        name: 'Invoices',
        description: 'Invoice management endpoints'
      }
    ]
  },
  apis: ['./controllers/**/*.js', './routes/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
