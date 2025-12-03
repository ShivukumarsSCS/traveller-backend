// src/routes/itineraryRoutes.ts

import { Router, Response } from 'express';
import { Itinerary } from '../models/Itinerary';
import { AuthRequest, protect } from '../middleware/auth';

const router = Router();

// POST /api/itineraries  (create a trip)
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const {
      destinationId,
      title,
      startDate,
      endDate,
      days,
      selectedHotel,
      selectedHotelIndex,
    } = req.body;

    console.log('Create itinerary body:', req.body);

    if (!destinationId || !title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const itinerary = await Itinerary.create({
      user: req.user!._id,
      destination: destinationId,
      title,
      startDate,
      endDate,
      days: days || [],

      // optional hotel fields
      selectedHotel: selectedHotel || null,
      selectedHotelIndex:
        typeof selectedHotelIndex === 'number' ? selectedHotelIndex : null,
    });

    // populate destination so frontend can use destination.name / latitude / longitude
    const populated = await itinerary.populate('destination');

    return res.status(201).json(populated);
  } catch (err: any) {
    console.error('Create itinerary error:', err);
    return res.status(500).json({ message: 'Failed to create itinerary' });
  }
});

// GET /api/itineraries/my  (all trips of logged-in user)
router.get('/my', protect, async (req: AuthRequest, res: Response) => {
  try {
    const list = await Itinerary.find({ user: req.user!._id })
      .populate('destination')
      // if selectedHotel is a ref, you can also populate it:
      // .populate('selectedHotel')
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.error('Get itineraries error:', err);
    res.status(500).json({ message: 'Failed to load itineraries' });
  }
});

// GET /api/itineraries/:id  (single trip)
router.get('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const itineraryId = req.params.id; // ✅ correct param name

    const item = await Itinerary.findOne({
      _id: itineraryId,
      user: req.user!._id,
    })
      .populate('destination')
      .populate('selectedHotel'); // ✅ so detail screen has hotel data

    if (!item) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(item);
  } catch (err) {
    console.error('Get itinerary error:', err);
    res.status(500).json({ message: 'Failed to load itinerary' });
  }
});

// DELETE /api/itineraries/:id
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    console.log('DELETE itinerary', req.params.id, 'user', req.user?._id);

    const deleted = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      user: req.user!._id,
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
