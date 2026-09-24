import mongoose, { Document, Schema } from 'mongoose';

export interface IAd extends Document {
  name: string;
  description: string;
  image?: string;
  video?: string;
  url: string;
  type: 'image' | 'video';
  placement: 'featured' | 'grid';
  status: 'active' | 'inactive';
}

const adSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    video: { type: String },
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    placement: { type: String, enum: ['featured', 'grid'], default: 'grid' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

export const Ad = mongoose.model<IAd>('Ad', adSchema);
