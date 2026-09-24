import { Request, Response } from 'express';
import { BugReport } from '../models/BugReport';

export const getBugReports = async (req: Request, res: Response): Promise<any> => {
  try {
    const reports = await BugReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBugStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const report = await BugReport.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBugReport = async (req: Request, res: Response): Promise<any> => {
  try {
    await BugReport.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bug report deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
