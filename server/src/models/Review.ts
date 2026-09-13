import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId;
  title: Types.ObjectId;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: Schema.Types.ObjectId,
    ref: 'Title',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// One review per user per title
ReviewSchema.index({ user: 1, title: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', ReviewSchema);