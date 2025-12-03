// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import destinationRoutes from './routes/destinationRoutes';
import seedRoutes from './routes/seedRoutes';

// If you already have these, keep them as they are:
import authRoutes from './routes/authRoutes';
import itineraryRoutes from './routes/itineraryRoutes';
import faqRoutes from './routes/faqRoutes';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Traveller API running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api', seedRoutes);          // => /api/seed

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
