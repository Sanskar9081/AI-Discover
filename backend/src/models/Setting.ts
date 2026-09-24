import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String },
  type: { type: String, default: 'string' },
  description: { type: String },
}, { timestamps: true });

export const Setting = mongoose.model('Setting', settingSchema);
