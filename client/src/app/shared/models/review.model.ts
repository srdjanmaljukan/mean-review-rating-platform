import { MediaType } from './title.model';

export interface Review {
  _id: string;
  user: { _id: string; username: string } | string;
  title: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number | null;
  count: number;
}