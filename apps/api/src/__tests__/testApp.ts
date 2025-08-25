import cors from 'cors';
import express from 'express';
import authRoutes from '../routes/authRoutes';
import categoryRoutes from '../routes/categoryRoutes';

export const createTestApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api', categoryRoutes);

  app.use('/', (_req, res) => {
    res.send('Welcome to Fintrak Test');
  });

  app.use((req, res) => {
    res
      .status(404)
      .json({ error: 'Route not found', path: req.path, method: req.method });
  });

  return app;
};
