import mongoose, { Document, Schema } from 'mongoose';

export interface IAdRequest extends Document {
  business_name: string;
  website: string;
  description: string;
  budget: string;
  contact_email: string;
  status: 'new' | 'contacted' | 'approved' | 'rejected';
}

const adRequestSchema = new Schema(
  {
    business_name: { type: String, required: true },
    website: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: String, required: true },
    contact_email: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'approved', 'rejected'], default: 'new' }
  },
  { timestamps: true }
);

export const AdRequest = mongoose.model<IAdRequest>('AdRequest', adRequestSchema);
