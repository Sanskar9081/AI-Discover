import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: Response, userId: string, role: string) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: expiresIn as any,
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
