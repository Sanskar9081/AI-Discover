import { Response } from 'express';
import { Rating } from '../models/Rating';
import { Tool } from '../models/Tool';
import { AuthRequest } from '../middleware/auth.middleware';

export const getRatings = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const ratings = await Rating.find({ tool: req.params.toolId });
    res.json(ratings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addRating = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { score } = req.body;
    const { toolId } = req.params;
    
    if (score < 1 || score > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const rating = await Rating.findOneAndUpdate(
      { user: req.user.userId, tool: toolId },
      { score },
      { upsert: true, new: true }
    );

    // Update tool average
    const allRatings = await Rating.find({ tool: toolId });
    const avg = allRatings.reduce((acc, curr) => acc + curr.score, 0) / allRatings.length;
    
    await Tool.findByIdAndUpdate(toolId, { rating: avg, reviewCount: allRatings.length });

    res.status(200).json(rating);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
