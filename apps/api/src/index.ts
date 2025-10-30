import dotenv from 'dotenv';
// IMPORTANT: Load environment variables BEFORE any other imports
dotenv.config();

import app from './app';
import connectDB from './config/db';

const PORT = Number(process.env.PORT) || 3000;

connectDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Server also accessible at http://192.168.1.113:${PORT}`);
});
