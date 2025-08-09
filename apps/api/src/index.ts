import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db';
import { specs, swaggerUi } from './config/swagger';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth/', authRoutes);
app.use('/api', productRoutes);

app.use('/', (_req, res) => {
  res.send('Welcome to the Fintrak API');
});

app.use((req, res) => {
  res
    .status(404)
    .json({ error: 'Route not found', path: req.path, method: req.method });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
