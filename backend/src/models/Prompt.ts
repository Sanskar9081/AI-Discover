import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  beforeImage: { type: String },
  afterImage: { type: String },
  author: { type: String, required: true },
  instagram: { type: String },
  featured: { type: Boolean, default: false },
  suggestedToolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, { timestamps: true });

promptSchema.index({ title: 'text', prompt: 'text' });

export const Prompt = mongoose.model('Prompt', promptSchema);
