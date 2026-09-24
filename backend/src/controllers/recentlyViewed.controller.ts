import { Response } from 'express';
import { RecentlyViewed } from '../models/RecentlyViewed';
import { AuthRequest } from '../middleware/auth.middleware';

export const getRecentlyViewed = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const views = await RecentlyViewed.find({ user: req.user.userId }).sort({ viewedAt: -1 }).limit(20).populate('tool');
    res.json(views);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addRecentlyViewed = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { toolId } = req.params;
    await RecentlyViewed.findOneAndUpdate(
      { user: req.user.userId, tool: toolId },
      { viewedAt: new Date() },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Recently viewed updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
