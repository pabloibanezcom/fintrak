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
