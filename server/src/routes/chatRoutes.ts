import { Router } from 'express';
import { askQuestion } from '../controllers/chatController.js';
import { optionalAuthenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/:id/chat', optionalAuthenticateToken, askQuestion);

export default router;
