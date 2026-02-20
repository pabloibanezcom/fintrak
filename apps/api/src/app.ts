import cors from 'cors';
import express from 'express';
import passport from 'passport';
import { specs, swaggerOptions, swaggerUi } from './config/swagger';
import './config/passport'; // Initialize passport configuration
import analyticsRoutes from './routes/analyticsRoutes';
import authRoutes from './routes/authRoutes';
import bankAccountRoutes from './routes/bankAccountRoutes';
import bankRoutes from './routes/bankRoutes';
import bankTransactionRoutes from './routes/bankTransactionRoutes';
import categoryRoutes from './routes/categoryRoutes';
import counterpartyRoutes from './routes/counterpartyRoutes';
import cronRoutes from './routes/cronRoutes';
import cryptoAssetRoutes from './routes/cryptoAssetRoutes';
import importRoutes from './routes/importRoutes';
import logoRoutes from './routes/logoRoutes';
import notificationRoutes from './routes/notificationRoutes';
import productRoutes from './routes/productRoutes';
import recurringTransactionRoutes from './routes/recurringTransactionRoutes';
import tagRoutes from './routes/tagRoutes';
import uploadRoutes from './routes/uploadRoutes';
import userTransactionRoutes from './routes/userTransactionRoutes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for profile picture uploads

// Initialize passport
app.use(passport.initialize());

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Cron routes MUST come first (no auth required)
app.use('/api', cronRoutes);

app.use('/api', analyticsRoutes);
app.use('/api/auth/', authRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/bank-transactions', bankTransactionRoutes);
app.use('/api', categoryRoutes);
app.use('/api', counterpartyRoutes);
app.use('/api', cryptoAssetRoutes);
app.use('/api', logoRoutes);
app.use('/api/import', importRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', productRoutes);
app.use('/api', recurringTransactionRoutes);
app.use('/api', tagRoutes);
app.use('/api', userTransactionRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/', (_req, res) => {
  res.send('Welcome to Fintrak');
});

app.use((req, res) => {
  res
    .status(404)
    .json({ error: 'Route not found', path: req.path, method: req.method });
});

export default app;
