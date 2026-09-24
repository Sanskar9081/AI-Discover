import mongoose from 'mongoose';

const recentlyViewedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
  viewedAt: { type: Date, default: Date.now },
});

recentlyViewedSchema.index({ user: 1, tool: 1 }, { unique: true });

export const RecentlyViewed = mongoose.model('RecentlyViewed', recentlyViewedSchema);
