import mongoose, { Document, Schema } from 'mongoose';

export interface IBugReport extends Document {
  title: string;
  description: string;
  page_feature: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_email: string;
  status: 'new' | 'in-progress' | 'resolved';
}

const bugReportSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    page_feature: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    user_email: { type: String, required: true },
    status: { type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new' }
  },
  { timestamps: true }
);

export const BugReport = mongoose.model<IBugReport>('BugReport', bugReportSchema);
