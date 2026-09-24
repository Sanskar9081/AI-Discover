import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';

export const getContactMessages = async (req: Request, res: Response): Promise<any> => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContactMessageStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContactMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact message deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
