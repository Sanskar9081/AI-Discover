import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

// Prevent duplicate ratings
ratingSchema.index({ user: 1, tool: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);
