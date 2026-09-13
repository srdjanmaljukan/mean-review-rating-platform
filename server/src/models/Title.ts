import mongoose, { Document, Schema } from 'mongoose';

export type MediaType = 'movie' | 'tv' | 'game' | 'anime' | 'manga';

export interface ITitle extends Document {
  externalId: string;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string | null;
  createdAt: Date;
}

const TitleSchema = new Schema<ITitle>({
  externalId: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv', 'game', 'anime', 'manga'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    default: '',
  },
  posterPath: {
    type: String,
    default: null,
  },
  releaseDate: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// A title is uniquely identified by its source + external ID combo
TitleSchema.index({ externalId: 1, mediaType: 1 }, { unique: true });

export default mongoose.model<ITitle>('Title', TitleSchema);