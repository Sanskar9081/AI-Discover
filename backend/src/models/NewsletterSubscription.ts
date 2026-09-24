import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletterSubscription extends Document {
  email: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  status: 'active' | 'unsubscribed';
  unsubscribeToken: string;
}

const newsletterSubscriptionSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    frequency: { type: String, enum: ['weekly', 'bi-weekly', 'monthly'], default: 'weekly' },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
    unsubscribeToken: { type: String, required: true }
  },
  { timestamps: true }
);

export const NewsletterSubscription = mongoose.model<INewsletterSubscription>('NewsletterSubscription', newsletterSubscriptionSchema);
