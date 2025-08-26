import cors from 'cors';
import express from 'express';
import { specs, swaggerOptions, swaggerUi } from './config/swagger';
import authRoutes from './routes/authRoutes';
import bankRoutes from './routes/bankRoutes';
import categoryRoutes from './routes/categoryRoutes';
import counterpartyRoutes from './routes/counterpartyRoutes';
import expenseRoutes from './routes/expenseRoutes';
import importRoutes from './routes/importRoutes';
import incomeRoutes from './routes/incomeRoutes';
import productRoutes from './routes/productRoutes';
import tagRoutes from './routes/tagRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

app.use('/api/auth/', authRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api', categoryRoutes);
app.use('/api', counterpartyRoutes);
app.use('/api', expenseRoutes);
app.use('/api/import', importRoutes);
app.use('/api', incomeRoutes);
app.use('/api', productRoutes);
app.use('/api', tagRoutes);

app.use('/', (_req, res) => {
  res.send('Welcome to Fintrak');
});

app.use((req, res) => {
  res
    .status(404)
    .json({ error: 'Route not found', path: req.path, method: req.method });
});

export default app;
