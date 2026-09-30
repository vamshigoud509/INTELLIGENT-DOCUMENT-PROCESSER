import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { dbService } from '../services/dbService.js';

export const getSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const summary = await dbService.getAnalyticsSummary(req.user?.id);
    res.status(200).json({
      success: true,
      ...summary
    });
  } catch (err: any) {
    console.error('Analytics error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve analytics overview.' });
  }
};
