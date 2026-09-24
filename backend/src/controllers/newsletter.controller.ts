import { Request, Response } from 'express';
import { NewsletterSubscription } from '../models/NewsletterSubscription';

export const getSubscriptions = async (req: Request, res: Response): Promise<any> => {
  try {
    const subscriptions = await NewsletterSubscription.find().sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const subscribe = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, frequency = 'weekly' } = req.body;
    
    // Check if exists
    let sub = await NewsletterSubscription.findOne({ email });
    if (sub) {
      if (sub.status === 'unsubscribed') {
        sub.status = 'active';
        sub.frequency = frequency;
        await sub.save();
        return res.json(sub);
      }
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const unsubscribeToken = Math.random().toString(36).substring(2, 15);
    sub = await NewsletterSubscription.create({ email, frequency, unsubscribeToken });
    res.status(201).json(sub);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unsubscribe = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.body;
    const sub = await NewsletterSubscription.findOneAndUpdate(
      { unsubscribeToken: token },
      { status: 'unsubscribed' },
      { new: true }
    );
    if (!sub) {
      return res.status(404).json({ message: 'Invalid token' });
    }
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFrequency = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { frequency } = req.body;
    const sub = await NewsletterSubscription.findByIdAndUpdate(id, { frequency }, { new: true });
    res.json(sub);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubscription = async (req: Request, res: Response): Promise<any> => {
  try {
    await NewsletterSubscription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscription deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
