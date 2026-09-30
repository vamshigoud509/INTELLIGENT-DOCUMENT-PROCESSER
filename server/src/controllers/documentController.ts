import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { dbService } from '../services/dbService.js';
import { geminiService } from '../services/geminiService.js';
import { loadSampleDocument } from '../services/sampleDataService.js';
import { IngestedDocument, DocumentDomain, DocumentAnomaly } from '../types/index.js';

export const uploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }

    const domainOverride = req.body.domain as DocumentDomain | undefined;
    const docId = uuidv4();
    const now = new Date().toISOString();

    const newDoc: IngestedDocument = {
      id: docId,
      user_id: req.user?.id,
      filename: file.filename,
      original_name: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
      file_url: `/uploads/${file.filename}`,
      domain: domainOverride || 'FINANCIAL',
      category: 'INVOICE',
      status: 'PROCESSING',
      confidence_score: 0,
      processing_time_ms: 0,
      created_at: now,
      updated_at: now
    };

    await dbService.createDocument(newDoc);

    // Return 202 Accepted immediately so client gets the tracking ID
    res.status(202).json({
      success: true,
      message: 'Document received and queued for intelligent analysis.',
      document: newDoc
    });

    // Run AI processing pipeline in background
    const startTime = Date.now();
    try {
      const result = await geminiService.processDocument(
        file.path,
        file.mimetype,
        file.originalname,
        domainOverride
      );

      const durationMs = Date.now() - startTime;

      // Update Document metadata
      await dbService.updateDocument(docId, {
        domain: result.domain,
        category: result.category,
        status: 'COMPLETED',
        confidence_score: result.confidenceScore,
        processing_time_ms: durationMs
      });

      // Save Extractions
      await dbService.saveExtraction({
        id: uuidv4(),
        document_id: docId,
        parties: result.extraction.parties,
        metadata_fields: result.extraction.metadata_fields,
        financials: result.extraction.financials,
        line_items: result.extraction.line_items,
        domain_specific: result.extraction.domain_specific,
        raw_summary: result.extraction.raw_summary,
        created_at: new Date().toISOString()
      });

      // Save Anomalies
      const anomaliesWithIds: DocumentAnomaly[] = result.anomalies.map(a => ({
        ...a,
        id: uuidv4(),
        document_id: docId,
        created_at: new Date().toISOString()
      }));
      await dbService.saveAnomalies(anomaliesWithIds);

      console.log(`✅ Document ${docId} processed successfully in ${durationMs}ms`);
    } catch (err: any) {
      console.error(`❌ Failed to process document ${docId}:`, err);
      await dbService.updateDocument(docId, {
        status: 'FAILED',
        error_message: err.message || 'Processing failed'
      });
    }
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Server error during document upload.' });
  }
};

export const listDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { search, domain, category, status } = req.query as Record<string, string>;

    const documents = await dbService.listDocuments({
      userId: req.user?.id,
      search,
      domain,
      category,
      status
    });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (err: any) {
    console.error('List documents error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve documents.' });
  }
};

export const getDocumentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const document = await dbService.getDocumentById(id);

    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found.' });
      return;
    }

    const extraction = await dbService.getExtractionByDocumentId(id);
    const anomalies = await dbService.getAnomaliesByDocumentId(id);
    const chatHistory = await dbService.getChatHistory(id);

    res.status(200).json({
      success: true,
      document,
      extraction,
      anomalies,
      chatHistory
    });
  } catch (err: any) {
    console.error('Get document details error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve document details.' });
  }
};

export const loadSample = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { sampleType } = req.body as { sampleType?: 'invoice' | 'medical_claim' | 'contract' | 'student_worksheet' };
    const sample = await loadSampleDocument(sampleType || 'invoice', req.user?.id);

    res.status(201).json({
      success: true,
      message: 'Sample document loaded successfully.',
      ...sample
    });
  } catch (err: any) {
    console.error('Load sample error:', err);
    res.status(500).json({ success: false, message: 'Failed to load sample document.' });
  }
};

export const reprocessDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const doc = await dbService.getDocumentById(id);

    if (!doc) {
      res.status(404).json({ success: false, message: 'Document not found.' });
      return;
    }

    await dbService.updateDocument(id, { status: 'PROCESSING' });

    res.status(202).json({
      success: true,
      message: 'Reprocessing triggered.'
    });

    // Re-run pipeline
    const startTime = Date.now();
    const filePath = path.resolve(process.cwd(), 'uploads', doc.filename);

    try {
      const result = await geminiService.processDocument(
        filePath,
        doc.mime_type,
        doc.original_name,
        doc.domain
      );

      const durationMs = Date.now() - startTime;
      await dbService.updateDocument(id, {
        domain: result.domain,
        category: result.category,
        status: 'COMPLETED',
        confidence_score: result.confidenceScore,
        processing_time_ms: durationMs,
        error_message: null
      });

      await dbService.saveExtraction({
        id: uuidv4(),
        document_id: id,
        parties: result.extraction.parties,
        metadata_fields: result.extraction.metadata_fields,
        financials: result.extraction.financials,
        line_items: result.extraction.line_items,
        domain_specific: result.extraction.domain_specific,
        raw_summary: result.extraction.raw_summary,
        created_at: new Date().toISOString()
      });

      const anomaliesWithIds: DocumentAnomaly[] = result.anomalies.map(a => ({
        ...a,
        id: uuidv4(),
        document_id: id,
        created_at: new Date().toISOString()
      }));
      await dbService.saveAnomalies(anomaliesWithIds);
    } catch (err: any) {
      await dbService.updateDocument(id, {
        status: 'FAILED',
        error_message: err.message || 'Reprocessing failed'
      });
    }
  } catch (err: any) {
    console.error('Reprocess error:', err);
    res.status(500).json({ success: false, message: 'Failed to reprocess document.' });
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const success = await dbService.deleteDocument(id);

    if (!success) {
      res.status(404).json({ success: false, message: 'Document not found or already deleted.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Document deleted successfully.' });
  } catch (err: any) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete document.' });
  }
};

export const exportDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const format = (req.query.format as string)?.toLowerCase() || 'json';

    const document = await dbService.getDocumentById(id);
    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found.' });
      return;
    }

    const extraction = await dbService.getExtractionByDocumentId(id);
    const anomalies = await dbService.getAnomaliesByDocumentId(id);

    const exportPayload = {
      document,
      extraction,
      anomalies,
      exportedAt: new Date().toISOString()
    };

    if (format === 'csv') {
      const lines = extraction?.line_items || [];
      const headers = ['Description', 'Quantity', 'UnitPrice', 'TaxRate', 'TotalPrice', 'Category'];
      const rows = lines.map(item => [
        `"${(item.description || '').replace(/"/g, '""')}"`,
        item.quantity ?? 1,
        item.unit_price ?? item.total_price,
        item.tax_rate ?? 0,
        item.total_price ?? 0,
        `"${(item.category || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${document.original_name}_extracted.csv"`);
      res.send(csvContent);
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${document.original_name}_extracted.json"`);
    res.send(JSON.stringify(exportPayload, null, 2));
  } catch (err: any) {
    console.error('Export error:', err);
    res.status(500).json({ success: false, message: 'Export generation failed.' });
  }
};
