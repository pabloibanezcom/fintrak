import fs from 'node:fs';
import path from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fintrak API',
      version: '1.0.0',
      description: 'API for financial tracking and product management',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

// Ensure docs directory exists
const docsDir = path.join(process.cwd(), '../../docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Write OpenAPI spec to file
const outputPath = path.join(docsDir, 'openapi.json');
fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));

console.log(`✅ OpenAPI spec generated at: ${outputPath}`);
