import { Request, Response } from 'express';
import jwt, {Secret, SignOptions} from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (userId: string): string => {
  const secret: Secret = process.env.JWT_SECRET as Secret;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const options: SignOptions = { expiresIn: '7d' };

  return jwt.sign({ userId }, secret, options);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(409).json({ message: 'Username or email already in use' });
      return;
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id);

    res.status(200).json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};