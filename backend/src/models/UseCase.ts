import mongoose, { Document, Schema } from 'mongoose';

export interface IUseCase extends Document {
  name: string;
  description: string;
  icon: string;
  order: number;
}

const useCaseSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const UseCase = mongoose.model<IUseCase>('UseCase', useCaseSchema);
