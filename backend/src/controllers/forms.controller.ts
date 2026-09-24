import { Request, Response } from 'express';
import { BugReport } from '../models/BugReport';
import { AdRequest } from '../models/AdRequest';
import { ContactMessage } from '../models/ContactMessage';

export const submitBugReport = async (req: Request, res: Response): Promise<any> => {
  try {
    const report = await BugReport.create(req.body);
    res.status(201).json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAdRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const request = await AdRequest.create(req.body);
    res.status(201).json(request);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitContactMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    const message = await ContactMessage.create(req.body);
    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
