//src/routes/itineraryRoutes.ts

import { Router, Response } from 'express';
import { Itinerary } from '../models/Itinerary';
import { AuthRequest, protect } from '../middleware/auth';

const router = Router();

// POST /api/itineraries  (create a trip)
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { destinationId, title, startDate, endDate, days } = req.body;
    console.log('Create itinerary body:', req.body);

    if (!destinationId || !title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const itinerary = await Itinerary.create({
      user: req.user!.id,
      destination: destinationId,
      title,
      startDate,
      endDate,
      days: days || [],
    });

    return res.status(201).json(itinerary);
  } catch (err: any) {
    console.error('Create itinerary error:', err);   // 👈 check this in backend console
    return res.status(500).json({ message: 'Failed to create itinerary' });
  }
});

// GET /api/itineraries/my  (all trips of logged-in user)
router.get('/my', protect, async (req: AuthRequest, res: Response) => {
  try {
    const list = await Itinerary.find({ user: req.user!.id })
      .populate('destination', 'name country');
    res.json(list);
  } catch (err) {
    console.error('Get itineraries error:', err);
    res.status(500).json({ message: 'Failed to load itineraries' });
  }
});

// GET /api/itineraries/:id  (single trip)
router.get('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const item = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user!.id,
    }).populate('destination', 'name country');

    if (!item) return res.status(404).json({ message: 'Not found' });

    res.json(item);
  } catch (err) {
    console.error('Get itinerary error:', err);
    res.status(500).json({ message: 'Failed to load itinerary' });
  }
});

// DELETE /api/itineraries/:id
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    console.log('DELETE itinerary', req.params.id, 'user', req.user?.id);

    const deleted = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      user: req.user!.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json({ message: 'Itinerary deleted' });
  } catch (err) {
    console.error('Delete itinerary error:', err);
    return res.status(500).json({ message: 'Failed to delete itinerary' });
  }
});


export default router;
