// src/routes/destinationRoutes.ts
import { Router, Request, Response } from 'express';
import { Destination } from '../models/Destination';

const router = Router();

// ✅ make this GET so you can call it from browser
router.get('/seed', async (_req: Request, res: Response) => {
  try {
    await Destination.deleteMany({});
    const created = await Destination.insertMany([
      {
        name: 'Paris, France',
        country: 'France',
        tagline: 'The City of Light',
        image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg',
        description:
          'Paris is known for its art, fashion, gastronomy and culture.',
        topAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'],
      },
      {
        name: 'New York City, USA',
        country: 'USA',
        tagline: 'The city that never sleeps',
        image: 'https://images.pexels.com/photos/374710/pexels-photo-374710.jpeg',
        description:
          'NYC is a bustling metropolis with iconic landmarks and culture.',
        topAttractions: ['Times Square', 'Central Park', 'Statue of Liberty'],
      },
    ]);
    console.log('Seeded destinations:', created.length);
    res.json(created);
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: 'Seeding failed' });
  }
});

// GET /api/destinations
router.get('/', async (_req: Request, res: Response) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/destinations/:id
router.get('/:id', async (req: Request, res: Response) => {
  const item = await Destination.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export default router;
