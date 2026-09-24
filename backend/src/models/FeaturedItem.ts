import mongoose from 'mongoose';

const featuredItemSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  item_type: { type: String, enum: ['tool', 'prompt'], required: true },
  order_index: { type: Number, default: 0 },
}, { timestamps: true });

featuredItemSchema.index({ item_id: 1, item_type: 1 }, { unique: true });

export const FeaturedItem = mongoose.model('FeaturedItem', featuredItemSchema);
