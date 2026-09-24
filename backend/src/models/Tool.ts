import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  pricing: { type: String, required: true },
  logo: { type: String, required: true },
  url: { type: String, required: true },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  features: { type: [String], default: [] },
  easeOfUse: { type: String, required: true },
  mainFunctionality: { type: String, required: true },
  freePlan: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isNewTool: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  useCase: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  couponCode: { type: String },
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, { timestamps: true });

toolSchema.index({ name: 'text', description: 'text', features: 'text', tags: 'text' });

export const Tool = mongoose.model('Tool', toolSchema);
