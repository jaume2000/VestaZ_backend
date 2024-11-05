"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
                url: 'http://localhost:' + (process.env.PORT || 5000) + '/api',
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
const setupSwaggerDocs = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
    console.log('Documentación de Swagger disponible en http://localhost:' + (process.env.PORT || 5000) + '/api-docs');
};
exports.setupSwaggerDocs = setupSwaggerDocs;
