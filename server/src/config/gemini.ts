import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const isPlaceholder = !apiKey || apiKey.includes('YourGeneratedSecretKeyHere') || apiKey === 'dummy-key-for-init';

if (isPlaceholder) {
  console.warn('⚠️ Notice: GEMINI_API_KEY is not configured or using default placeholder. High-fidelity heuristic IDP fallback engine is active for smooth demonstrations.');
} else {
  console.log('✨ Gemini Vision IDP Model successfully configured.');
}

export const genAI = !isPlaceholder ? new GoogleGenerativeAI(apiKey) : null;
export const hasValidGeminiKey = !isPlaceholder;
