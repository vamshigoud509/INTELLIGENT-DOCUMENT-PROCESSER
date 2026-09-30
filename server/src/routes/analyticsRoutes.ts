import { Router } from 'express';
import { getSummary } from '../controllers/analyticsController.js';
import { optionalAuthenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/summary', optionalAuthenticateToken, getSummary);

export default router;
