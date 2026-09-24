import { Request, Response } from 'express';
import { Ad } from '../models/Ad';

export const getAds = async (req: Request, res: Response): Promise<any> => {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAd = async (req: Request, res: Response): Promise<any> => {
  try {
    const ad = await Ad.create(req.body);
    res.status(201).json(ad);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAd = async (req: Request, res: Response): Promise<any> => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ad);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAd = async (req: Request, res: Response): Promise<any> => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ad deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
