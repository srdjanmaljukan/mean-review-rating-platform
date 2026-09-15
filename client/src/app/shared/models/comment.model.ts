export interface Comment {
  _id: string;
  user: { _id: string; username: string } | string;
  review: string;
  text: string;
  createdAt: string;
}