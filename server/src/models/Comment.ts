import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IComment extends Document {
  user: Types.ObjectId;
  review: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IComment>('Comment', CommentSchema);