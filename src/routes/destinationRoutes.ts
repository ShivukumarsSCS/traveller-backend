// src/routes/destinationRoutes.ts
import { Router, Request, Response } from 'express';
import { Destination } from '../models/Destination';

const router = Router();

// GET /api/destinations - list all destinations
router.get('/', async (_req: Request, res: Response) => {
  try {
    const destinations = await Destination.find().sort({ popularityScore: -1 });
    res.json(destinations);
  } catch (err) {
    console.error('Fetch destinations error:', err);
    res.status(500).json({ message: 'Failed to load destinations' });
  }
});

// GET /api/destinations/:id - single destination by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(dest);
  } catch (err) {
    console.error('Fetch destination error:', err);
    res.status(500).json({ message: 'Failed to load destination' });
  }
});

export default router;
