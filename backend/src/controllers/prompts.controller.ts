import { Request, Response } from 'express';
import { Prompt } from '../models/Prompt';

export const getPrompts = async (req: Request, res: Response): Promise<any> => {
  try {
    const prompts = await Prompt.find({}).populate('category').populate('suggestedToolId');
    res.json(prompts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPromptById = async (req: Request, res: Response): Promise<any> => {
  try {
    const prompt = await Prompt.findById(req.params.id).populate('category').populate('suggestedToolId');
    if (prompt) {
      res.json(prompt);
    } else {
      res.status(404).json({ message: 'Prompt not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPrompt = async (req: Request, res: Response): Promise<any> => {
  try {
    const prompt = await Prompt.create(req.body);
    res.status(201).json(prompt);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePrompt = async (req: Request, res: Response): Promise<any> => {
  try {
    const prompt = await Prompt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prompt);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePrompt = async (req: Request, res: Response): Promise<any> => {
  try {
    await Prompt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prompt removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
