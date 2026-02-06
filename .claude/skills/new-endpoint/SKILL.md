---
name: new-endpoint
description: Create a new API endpoint with controller, route, and Swagger documentation
---

# Create New API Endpoint

When the user asks to create a new endpoint, create all required files:

## File Structure

```
apps/api/src/
├── controllers/FeatureController.ts  # Request handling
├── routes/featureRoutes.ts           # Route definitions
└── models/FeatureModel.ts            # (if new data model needed)
```

## Templates

### Controller (controllers/FeatureController.ts)

```typescript
import type { Request, Response } from 'express';

export const FeatureController = {
  async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      // Implementation
      res.json({ data: [] });
    } catch (error) {
      console.error('FeatureController.getAll error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Implementation
      res.json({ data: null });
    } catch (error) {
      console.error('FeatureController.getById error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const data = req.body;
      // Implementation
      res.status(201).json({ data: null });
    } catch (error) {
      console.error('FeatureController.create error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Implementation
      res.json({ data: null });
    } catch (error) {
      console.error('FeatureController.update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Implementation
      res.status(204).send();
    } catch (error) {
      console.error('FeatureController.delete error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
```

### Routes (routes/featureRoutes.ts)

```typescript
import { Router } from 'express';
import { FeatureController } from '../controllers/FeatureController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/features:
 *   get:
 *     summary: Get all features
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of features
 */
router.get('/', authenticate, FeatureController.getAll);

/**
 * @swagger
 * /api/features/{id}:
 *   get:
 *     summary: Get feature by ID
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feature details
 */
router.get('/:id', authenticate, FeatureController.getById);

/**
 * @swagger
 * /api/features:
 *   post:
 *     summary: Create a new feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Feature created
 */
router.post('/', authenticate, FeatureController.create);

/**
 * @swagger
 * /api/features/{id}:
 *   put:
 *     summary: Update a feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feature updated
 */
router.put('/:id', authenticate, FeatureController.update);

/**
 * @swagger
 * /api/features/{id}:
 *   delete:
 *     summary: Delete a feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Feature deleted
 */
router.delete('/:id', authenticate, FeatureController.delete);

export default router;
```

## After Creation

1. Register route in `apps/api/src/index.ts`:
   ```typescript
   import featureRoutes from './routes/featureRoutes';
   app.use('/api/features', featureRoutes);
   ```

2. Verify Swagger docs at `http://localhost:3000/api/docs`

3. Run `pnpm lint-fix` in the api package

## ⚠️ CRITICAL: Update Postman Collection

**MANDATORY STEP**: Whenever you create, modify, or delete ANY API endpoint, you **MUST** update the Postman collection file:

**File Location**: `apps/api/Fintrak-API.postman_collection.json`

### What to Update

For **new endpoints**:
- Add a new request item to the appropriate folder/category
- Include request method, URL, headers, and body examples
- Add response examples with status codes
- Include descriptions for the endpoint

For **modified endpoints**:
- Update request parameters, body schema, or headers
- Update response examples if the response structure changed
- Update descriptions if functionality changed

For **deleted endpoints**:
- Remove the corresponding request item from the collection

### Postman Request Template

```json
{
  "name": "Endpoint Name",
  "request": {
    "method": "GET|POST|PUT|DELETE",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\"example\": \"data\"}"
    },
    "url": {
      "raw": "{{rootUrl}}/api/endpoint",
      "host": ["{{rootUrl}}"],
      "path": ["api", "endpoint"]
    },
    "description": "Description of what this endpoint does"
  },
  "response": [
    {
      "name": "Success",
      "originalRequest": { /* same as request */ },
      "status": "OK",
      "code": 200,
      "_postman_previewlanguage": "json",
      "header": [
        {
          "key": "Content-Type",
          "value": "application/json"
        }
      ],
      "cookie": [],
      "body": "{\"example\": \"response\"}"
    }
  ]
}
```

### Important Notes

- The Postman collection serves as the **primary API documentation** for external consumers
- Keeping it updated ensures developers and testers have accurate API references
- Always test the updated Postman requests to verify they work correctly
- Use environment variables like `{{rootUrl}}` and `{{auth_token}}` for flexibility
