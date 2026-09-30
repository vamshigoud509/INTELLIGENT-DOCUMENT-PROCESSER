import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { dbService } from './services/dbService.js';
import { loadSampleDocument } from './services/sampleDataService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Ensure uploads folder exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security & Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Allow dynamic embeds for PDF/document viewer
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or localhost/Vercel
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static route for serving uploaded documents and PDFs
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'DocuSphere IDP Backend', timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'DocuSphere IDP Backend', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/documents', chatRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Auto-seed sample documents if database is fresh
const seedInitialData = async () => {
  try {
    const existing = await dbService.listDocuments();
    if (existing.length === 0) {
      console.log('🌱 Seeding initial high-impact IDP sample documents (Invoice, Medical Claim, SLA Contract)...');
      await loadSampleDocument('invoice');
      await loadSampleDocument('medical_claim');
      await loadSampleDocument('contract');
      console.log('✅ Initial demo documents seeded successfully.');
    }
  } catch (err) {
    console.error('Warning during demo seed:', err);
  }
};

app.listen(PORT, async () => {
  console.log(`🚀 DocuSphere IDP Server running on port ${PORT}`);
  console.log(`📡 Client origin: ${CLIENT_ORIGIN}`);
  await seedInitialData();
});
