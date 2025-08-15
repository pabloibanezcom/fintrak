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

export { specs, swaggerUi };
