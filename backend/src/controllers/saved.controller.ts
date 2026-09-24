import { Response } from 'express';
import { SavedItem } from '../models/SavedItem';
import { AuthRequest } from '../middleware/auth.middleware';

export const getSavedItems = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const saved = await SavedItem.find({ user: req.user.userId }).populate('tool').populate('prompt');
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const saveItem = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { toolId, promptId, itemType } = req.body;
    const existing = await SavedItem.findOne({ 
      user: req.user.userId, 
      ...(toolId ? { tool: toolId } : { prompt: promptId }),
      itemType 
    });
    if (existing) {
      return res.status(400).json({ message: 'Item already saved' });
    }
    const saved = await SavedItem.create({ user: req.user.userId, tool: toolId, prompt: promptId, itemType });
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSavedItem = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    await SavedItem.findOneAndDelete({
      user: req.user.userId,
      $or: [{ tool: id }, { prompt: id }]
    });
    res.json({ message: 'Saved item removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
