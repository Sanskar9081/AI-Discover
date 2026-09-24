import { Request, Response } from 'express';
import { AdRequest } from '../models/AdRequest';

export const getAdRequests = async (req: Request, res: Response): Promise<any> => {
  try {
    const requests = await AdRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    await AdRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ad request deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
