import { Request, Response } from 'express';
import { Setting } from '../models/Setting';

export const getSettings = async (req: Request, res: Response): Promise<any> => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSetting = async (req: Request, res: Response): Promise<any> => {
  try {
    const setting = await Setting.findOneAndUpdate({ key: req.params.key }, req.body, { new: true, upsert: true });
    res.json(setting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
