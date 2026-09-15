import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWatchlistItem extends Document {
  user: Types.ObjectId;
  title: Types.ObjectId;
  addedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlistItem>({
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
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// A title can only appear once per user's watchlist
WatchlistSchema.index({ user: 1, title: 1 }, { unique: true });

export default mongoose.model<IWatchlistItem>('Watchlist', WatchlistSchema);