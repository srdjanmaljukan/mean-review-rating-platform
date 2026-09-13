import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import titleRoutes from './routes/title.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route (temporary, just to confirm server works)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes will be mounted here as we build them:
app.use('/api/auth', authRoutes);
app.use('/api/titles', titleRoutes);
// app.use('/api/reviews', reviewRoutes);

export default app;