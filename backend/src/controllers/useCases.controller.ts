import { Request, Response } from 'express';
import { UseCase } from '../models/UseCase';

export const getUseCases = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCases = await UseCase.find().sort({ order: 1 });
    res.json(useCases);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createUseCase = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = await UseCase.create(req.body);
    res.status(201).json(useCase);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUseCase = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = await UseCase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(useCase);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUseCase = async (req: Request, res: Response): Promise<any> => {
  try {
    await UseCase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Use case deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
