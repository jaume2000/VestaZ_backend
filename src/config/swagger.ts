import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { Express } from 'express';

// Definir las opciones de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Marketplace API',
      version: '1.0.0',
      description: 'API para un marketplace con múltiples vendedores',
    },
    servers: [
      {
        url: 'http://localhost:'+(process.env.PORT || 5000)+'/api',
        description: 'Servidor local'
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'], // Ubicación de los archivos con las rutas de la API
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const setupSwaggerDocs = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log('Documentación de Swagger disponible en http://localhost:'+(process.env.PORT || 5000)+'/api-docs');
};
