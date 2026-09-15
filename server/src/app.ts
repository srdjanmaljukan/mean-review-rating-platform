import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import titleRoutes from './routes/title.routes';
import reviewRoutes from './routes/review.routes';
import watchlistRoutes from './routes/watchlist.routes';
import userRoutes from './routes/user.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route (temporary, just to confirm server works)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/titles', titleRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/users', userRoutes);


export default app;