import express from 'express';
import rateLimit from 'express-rate-limit';
import { AIService } from '../utils';
import { asyncWrapper } from '../middleware';

const router = express.Router();

// Rate limiting for AI endpoints
const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many AI requests from this IP, please try again later.',
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all AI routes
router.use(aiRateLimit);

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

// Generate complete snippet details from code
router.post('/generate-snippet', asyncWrapper(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).json({
      error: 'Code is required'
    });
    return;
  }

  try {
    const aiService = getAIService();
    const snippetDetails = await aiService.generateSnippetDetails(code);

    res.json({
      ...snippetDetails,
      success: true
    });
  } catch (error: any) {
    res.status(503).json({
      error: error.message || 'AI service temporarily unavailable',
      success: false
    });
  }
}));

// Code optimization analysis endpoint
router.post('/optimize', asyncWrapper(async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    res.status(400).json({
      error: 'Code and language are required'
    });
    return;
  }

  try {
    const aiService = getAIService();
    const optimization = await aiService.optimizeCode(code, language);

    res.json({
      ...optimization,
      success: true
    });
  } catch (error: any) {
    res.status(503).json({
      error: error.message || 'AI service temporarily unavailable',
      success: false
    });
  }
}));

// Generate optimized version of code
router.post('/optimize-code', asyncWrapper(async (req, res) => {
  const { code, language, focusArea } = req.body;

  if (!code || !language) {
    res.status(400).json({
      error: 'Code and language are required'
    });
    return;
  }

  try {
    const aiService = getAIService();
    const optimizedCode = await aiService.generateOptimizedVersion(code, language, focusArea);

    res.json({
      optimizedCode,
      originalCode: code,
      focusArea: focusArea || 'general',
      success: true
    });
  } catch (error: any) {
    res.status(503).json({
      error: error.message || 'AI service temporarily unavailable',
      success: false
    });
  }
}));

// Security analysis endpoint
router.post('/security-scan', asyncWrapper(async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    res.status(400).json({
      error: 'Code and language are required'
    });
    return;
  }

  try {
    const aiService = getAIService();
    const securityIssues = await aiService.getSecurityAnalysis(code, language);

    res.json({
      securityIssues,
      riskLevel: securityIssues.length > 0 ? 
        securityIssues.some((issue: any) => issue.severity === 'critical' || issue.severity === 'high') ? 'high' : 'medium' : 'low',
      issueCount: securityIssues.length,
      success: true
    });
  } catch (error: any) {
    res.status(503).json({
      error: error.message || 'AI service temporarily unavailable',
      success: false
    });
  }
}));

// Code conversion endpoint
router.post('/convert-code', asyncWrapper(async (req, res) => {
  const { code, sourceLanguage, targetLanguage } = req.body;

  if (!code || !sourceLanguage || !targetLanguage) {
    res.status(400).json({
      error: 'Code, source language, and target language are required'
    });
    return;
  }

  if (sourceLanguage === targetLanguage) {
    res.status(400).json({
      error: 'Source and target languages cannot be the same'
    });
    return;
  }

  try {
    const aiService = getAIService();
    const conversion = await aiService.convertCode(code, sourceLanguage, targetLanguage);

    res.json({
      ...conversion,
      success: true
    });
  } catch (error: any) {
    res.status(503).json({
      error: error.message || 'AI service temporarily unavailable',
      success: false
    });
  }
}));

// Language feature comparison endpoint
router.post('/compare-languages', asyncWrapper(async (req, res) => {
  const { sourceLanguage, targetLanguage } = req.body;

  if (!sourceLanguage || !targetLanguage) {
    res.status(400).json({
      error: 'Source and target languages are required'
    });
    return;
  }

  try {
    const aiService = getAIService();
    const comparison = await aiService.getLanguageFeatureComparison(sourceLanguage, targetLanguage);

    res.json({
      comparison,
      sourceLanguage,
      targetLanguage,
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
