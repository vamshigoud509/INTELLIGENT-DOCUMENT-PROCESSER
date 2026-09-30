import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { dbService } from '../services/dbService.js';
import { geminiService } from '../services/geminiService.js';
import { ChatMessage } from '../types/index.js';

export const askQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, message: 'Message string is required.' });
      return;
    }

    const document = await dbService.getDocumentById(id);
    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found.' });
      return;
    }

    const extraction = await dbService.getExtractionByDocumentId(id);
    if (!extraction) {
      res.status(400).json({ success: false, message: 'Document is not yet processed or extracted.' });
      return;
    }

    // Record user query in history
    const userMsg: ChatMessage = {
      id: uuidv4(),
      document_id: id,
      user_id: req.user?.id,
      role: 'user',
      message: message.trim(),
      created_at: new Date().toISOString()
    };
    await dbService.addChatMessage(userMsg);

    // Retrieve previous history
    const history = await dbService.getChatHistory(id);

    // Call Gemini Q&A
    const { reply, sources } = await geminiService.askDocumentQuestion(
      extraction,
      message,
      history.map(h => ({ role: h.role, message: h.message }))
    );

    // Record assistant response
    const assistantMsg: ChatMessage = {
      id: uuidv4(),
      document_id: id,
      user_id: req.user?.id,
      role: 'assistant',
      message: reply,
      sources,
      created_at: new Date().toISOString()
    };
    await dbService.addChatMessage(assistantMsg);

    res.status(200).json({
      success: true,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      reply,
      sources
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ success: false, message: 'Failed to process document query.' });
  }
};
