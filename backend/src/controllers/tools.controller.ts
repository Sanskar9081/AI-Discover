import { Request, Response } from 'express';
import { Tool } from '../models/Tool';

export const getTools = async (req: Request, res: Response): Promise<any> => {
  try {
    const { category, search, pricing, sort, page = '1', limit = '50' } = req.query;
    let query: any = {};

    // Filter by category
    if (category && category !== 'All') {
      const Category = require('../models/Category').Category;
      const cat = await Category.findOne({ name: category });
      if (cat) {
        query.category = cat._id;
      } else {
        // If category not found, return empty result
        return res.json([]);
      }
    }

    // Filter by search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by pricing
    if (pricing && pricing !== 'All') {
      query.pricing = pricing;
    }

    // Sorting
    let sortQuery: any = { createdAt: -1 };
    if (sort === 'rating') sortQuery = { rating: -1 };
    if (sort === 'views') sortQuery = { views: -1 };
    if (sort === 'newest') sortQuery = { createdAt: -1 };
    if (sort === 'oldest') sortQuery = { createdAt: 1 };

    // Pagination
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const tools = await Tool.find(query).sort(sortQuery).skip(skip).limit(limitNumber).populate('category');
    res.json(tools);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getToolById = async (req: Request, res: Response): Promise<any> => {
  try {
    const tool = await Tool.findById(req.params.id).populate('category');
    if (tool) {
      res.json(tool);
    } else {
      res.status(404).json({ message: 'Tool not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTool = async (req: Request, res: Response): Promise<any> => {
  try {
    const tool = await Tool.create(req.body);
    res.status(201).json(tool);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTool = async (req: Request, res: Response): Promise<any> => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tool);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTool = async (req: Request, res: Response): Promise<any> => {
  try {
    await Tool.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tool removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const incrementClicks = async (req: Request, res: Response): Promise<any> => {
  try {
    await Tool.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    res.json({ message: 'Clicks incremented' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const incrementViews = async (req: Request, res: Response): Promise<any> => {
  try {
    await Tool.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ message: 'Views incremented' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
