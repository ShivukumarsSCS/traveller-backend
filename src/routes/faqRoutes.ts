import { Router, Request, Response } from 'express';
import { FAQ } from '../models/FAQ';

const router = Router();

/**
 * Seed FAQs
 * GET /api/faqs/seed
 */
router.get('/seed', async (_req: Request, res: Response) => {
  try {
    await FAQ.deleteMany({});

    const created = await FAQ.insertMany([
      {
        question: 'How do I plan a trip in this app?',
        answer:
          'Go to "My trips", tap "Create new trip", choose your dates and add places you want to visit.',
        order: 1,
      },
      {
        question: 'Can I edit my trip later?',
        answer:
          'Yes, you can open any saved trip and change dates, places, and notes anytime.',
        order: 2,
      },
      {
        question: 'Do you show hotels and stays?',
        answer:
          'Yes, you can explore hotels near your destination from the Explore or Hotels tab.',
        order: 3,
      },
    ]);

    res.json(created);
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    res.status(500).json({ message: 'FAQ seed failed' });
  }
});

/**
 * GET /api/faqs
 * All active FAQs
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
