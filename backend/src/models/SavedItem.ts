import mongoose from 'mongoose';

const savedItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
  prompt: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' },
  itemType: { type: String, enum: ['tool', 'prompt'], required: true },
}, { timestamps: true });

savedItemSchema.index({ user: 1, tool: 1, itemType: 1 }, { unique: true, sparse: true });
savedItemSchema.index({ user: 1, prompt: 1, itemType: 1 }, { unique: true, sparse: true });

export const SavedItem = mongoose.model('SavedItem', savedItemSchema);
