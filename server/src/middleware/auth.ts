import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/auth.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    // For demo convenience, if no token provided, we can assign a default demo user ID
    // but in strict mode we can require auth. Let's support guest/demo fallback if desired or require token.
    res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
    return;
  }
};

export const optionalAuthenticateToken = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // ignore
    }
  }
  next();
};
