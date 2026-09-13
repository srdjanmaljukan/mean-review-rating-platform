import { Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (userId: string): string => {
  const secret: Secret = process.env.JWT_SECRET as Secret;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const options: SignOptions = { expiresIn: '7d' };

  return jwt.sign({ userId }, secret, options);
};