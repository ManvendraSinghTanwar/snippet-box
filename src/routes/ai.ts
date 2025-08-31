import express from 'express';
import { AIService } from '../utils';
import { asyncWrapper } from '../middleware';

const router = express.Router();

// Helper function to get AI service with error handling
const getAIService = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  return new AIService();
};

// Explain code endpoint
router.post('/explain', asyncWrapper(async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    res.status(400).json({
      error: 'Code and language are required'
    });
    return;
  }

  try {
    const aiService = getAIService();
    const explanation = await aiService.explainCode(code, language);

    res.json({
      explanation,
      success: true
    });
  } catch (error: any) {
    res.status(503).json({
      error: error.message || 'AI service temporarily unavailable',
      success: false
    });
  }
}));

// Generate tags endpoint
router.post('/generate-tags', asyncWrapper(async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    res.status(400).json({
      error: 'Code and language are required'
    });
    return;
  }

  try {
    const aiService = getAIService();
    const tags = await aiService.generateTags(code, language);

    res.json({
      tags,
      success: true
    });
  } catch (error: any) {
    res.status(503).json({
      error: error.message || 'AI service temporarily unavailable',
      success: false
    });
  }
}));

// Analyze code endpoint (comprehensive analysis)
router.post('/analyze', asyncWrapper(async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    res.status(400).json({
      error: 'Code and language are required'
    });
    return;
  }

  try {
    const aiService = getAIService();
    const analysis = await aiService.analyzeCode(code, language);

    res.json({
      ...analysis,
      success: true
    });
  } catch (error: any) {
    res.status(503).json({
      error: error.message || 'AI service temporarily unavailable',
      success: false
    });
  }
}));

export default router;
