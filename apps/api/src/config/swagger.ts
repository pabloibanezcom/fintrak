import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password',
            },
            name: {
              type: 'string',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
            },
          },
        },
        UserRegister: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password',
            },
          },
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token',
            },
            id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              description: 'User email',
            },
          },
        },
        Deposit: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Deposit ID',
            },
            amount: {
              type: 'number',
              description: 'Deposit amount',
            },
            currency: {
              type: 'string',
              description: 'Currency code',
            },
            interestRate: {
              type: 'number',
              description: 'Interest rate',
            },
            maturityDate: {
              type: 'string',
              format: 'date',
              description: 'Maturity date',
            },
          },
        },
        CashAccount: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Account ID',
            },
            balance: {
              type: 'number',
              description: 'Account balance',
            },
            currency: {
              type: 'string',
              description: 'Currency code',
            },
            accountType: {
              type: 'string',
              description: 'Type of cash account',
            },
          },
        },
        IndexedFund: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Fund ID',
            },
            name: {
              type: 'string',
              description: 'Fund name',
            },
            value: {
              type: 'number',
              description: 'Current value',
            },
            currency: {
              type: 'string',
              description: 'Currency code',
            },
            performance: {
              type: 'number',
              description: 'Performance percentage',
            },
          },
        },
        UserProducts: {
          type: 'object',
          properties: {
            deposits: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Deposit',
              },
            },
            cashAccounts: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CashAccount',
              },
            },
            indexedFunds: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/IndexedFund',
              },
            },
          },
        },
        Expense: {
          type: 'object',
          required: ['title', 'amount', 'category', 'date'],
          properties: {
            id: {
              type: 'string',
              description: 'Expense ID',
            },
            title: {
              type: 'string',
              description: 'Expense title',
            },
            amount: {
              type: 'number',
              minimum: 0,
              description: 'Expense amount',
            },
            category: {
              type: 'string',
              enum: [
                'food',
                'transport',
                'entertainment',
                'utilities',
                'shopping',
                'healthcare',
                'other',
              ],
              description: 'Expense category',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Expense date',
            },
            description: {
              type: 'string',
              description: 'Optional expense description',
            },
            userId: {
              type: 'string',
              description: 'User ID',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        CreateExpenseRequest: {
          type: 'object',
          required: ['title', 'amount', 'category', 'date'],
          properties: {
            title: {
              type: 'string',
              description: 'Expense title',
            },
            amount: {
              type: 'number',
              minimum: 0,
              description: 'Expense amount',
            },
            category: {
              type: 'string',
              enum: [
                'food',
                'transport',
                'entertainment',
                'utilities',
                'shopping',
                'healthcare',
                'other',
              ],
              description: 'Expense category',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Expense date',
            },
            description: {
              type: 'string',
              description: 'Optional expense description',
            },
          },
        },
        UpdateExpenseRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Expense title',
            },
            amount: {
              type: 'number',
              minimum: 0,
              description: 'Expense amount',
            },
            category: {
              type: 'string',
              enum: [
                'food',
                'transport',
                'entertainment',
                'utilities',
                'shopping',
                'healthcare',
                'other',
              ],
              description: 'Expense category',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Expense date',
            },
            description: {
              type: 'string',
              description: 'Optional expense description',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API files
};

const specs = swaggerJsdoc(options);

// Soft theme customization for Swagger UI
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
    .swagger-ui .info .title { color: #3f51b5; font-size: 36px; }
    .swagger-ui .scheme-container { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .swagger-ui .opblock.opblock-post { border-color: #4caf50; }
    .swagger-ui .opblock.opblock-post .opblock-summary { border-color: #4caf50; background: rgba(76, 175, 80, 0.1); }
    .swagger-ui .opblock.opblock-get { border-color: #2196f3; }
    .swagger-ui .opblock.opblock-get .opblock-summary { border-color: #2196f3; background: rgba(33, 150, 243, 0.1); }
    .swagger-ui .opblock.opblock-put { border-color: #ff9800; }
    .swagger-ui .opblock.opblock-put .opblock-summary { border-color: #ff9800; background: rgba(255, 152, 0, 0.1); }
    .swagger-ui .opblock.opblock-delete { border-color: #f44336; }
    .swagger-ui .opblock.opblock-delete .opblock-summary { border-color: #f44336; background: rgba(244, 67, 54, 0.1); }
    .swagger-ui .btn.authorize { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 6px;
      color: white;
      padding: 8px 16px;
      font-weight: 500;
    }
    .swagger-ui .btn.execute { 
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      border: none;
      border-radius: 6px;
      color: white;
      padding: 8px 20px;
      font-weight: 500;
    }
    .swagger-ui .parameters-col_description p,
    .swagger-ui .parameters-col_description div { color: #666; }
    .swagger-ui .response-col_description p { color: #666; }
    .swagger-ui .model { background: #f8f9fa; border-radius: 6px; padding: 15px; }
    .swagger-ui .model-title { color: #3f51b5; font-weight: 600; }
    .swagger-ui section.models { background: #f8f9fa; padding: 20px; border-radius: 8px; }
    .swagger-ui .opblock-summary-description { color: #666; font-style: italic; }
    .swagger-ui .parameter__name { color: #3f51b5; font-weight: 500; }
    .swagger-ui .response-col_status { font-weight: 600; }
    .swagger-ui .opblock-section-header { background: #f5f5f5; padding: 12px 20px; border-radius: 6px; }
    .swagger-ui .opblock-section-header h4 { color: #333; margin: 0; }
    .swagger-ui .tab li { border-radius: 6px 6px 0 0; }
    .swagger-ui .tab li.active { background: #e3f2fd; }
    .swagger-ui input[type=text], 
    .swagger-ui input[type=password], 
    .swagger-ui input[type=email], 
    .swagger-ui textarea,
    .swagger-ui select { 
      border: 2px solid #e0e0e0; 
      border-radius: 6px; 
      padding: 10px; 
      transition: border-color 0.3s ease;
    }
    .swagger-ui input[type=text]:focus, 
    .swagger-ui input[type=password]:focus, 
    .swagger-ui input[type=email]:focus, 
    .swagger-ui textarea:focus,
    .swagger-ui select:focus { 
      border-color: #3f51b5; 
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
      outline: none;
    }
    .swagger-ui .info .description { color: #666; line-height: 1.6; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  `,
  customSiteTitle: "Fintrak API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    docExpansion: 'none',
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 3,
  }
};

export { specs, swaggerUi, swaggerOptions };
