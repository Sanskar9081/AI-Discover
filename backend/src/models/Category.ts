import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
