import { Router } from 'express';
import { 
  uploadDocument, 
  listDocuments, 
  getDocumentById, 
  loadSample,
  reprocessDocument, 
  deleteDocument,
  exportDocument
} from '../controllers/documentController.js';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// In demo mode or production, allow optional/authenticated token
router.post('/upload', optionalAuthenticateToken, upload.single('file'), uploadDocument);
router.post('/load-sample', optionalAuthenticateToken, loadSample);
router.get('/', optionalAuthenticateToken, listDocuments);
router.get('/:id', optionalAuthenticateToken, getDocumentById);
router.post('/:id/reprocess', optionalAuthenticateToken, reprocessDocument);
router.delete('/:id', optionalAuthenticateToken, deleteDocument);
router.get('/:id/export', optionalAuthenticateToken, exportDocument);

export default router;
