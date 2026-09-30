import { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { dbService } from '../services/dbService.js';
import { hashPassword, comparePassword, generateToken } from '../config/auth.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name is required'),
  organization: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required')
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors.map(e => e.message).join(', ')
      });
      return;
    }

    const { email, password, name, organization } = parseResult.data;

    const existing = await dbService.findUserByEmail(email);
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
      return;
    }

    const password_hash = await hashPassword(password);
    const userId = uuidv4();
    const newUser = await dbService.createUser({
      id: userId,
      email,
      password_hash,
      name,
      organization: organization || 'Enterprise Corp',
      role: 'analyst',
      created_at: new Date().toISOString()
    });

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      user: newUser,
      token
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors.map(e => e.message).join(', ')
      });
      return;
    }

    const { email, password } = parseResult.data;

    const userWithHash = await dbService.findUserByEmail(email);
    if (!userWithHash) {
      // Demo convenience: If user doesn't exist, auto-register for demo credentials
      if (email === 'demo@docusphere.io' && password === 'password123') {
        const password_hash = await hashPassword(password);
        const newUser = await dbService.createUser({
          id: uuidv4(),
          email,
          password_hash,
          name: 'Enterprise Analyst',
          organization: 'DocuSphere Global Audit',
          role: 'admin',
          created_at: new Date().toISOString()
        });
        const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });
        res.status(200).json({
          success: true,
          message: 'Demo session initialized.',
          user: newUser,
          token
        });
        return;
      }

      res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
      return;
    }

    const isMatch = await comparePassword(password, userWithHash.password_hash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
      return;
    }

    const { password_hash, ...safeUser } = userWithHash;
    const token = generateToken({ id: safeUser.id, email: safeUser.email, role: safeUser.role });

    res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      user: safeUser,
      token
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const user = await dbService.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (err: any) {
    console.error('getMe error:', err);
    res.status(500).json({ success: false, message: 'Error retrieving user profile.' });
  }
};
