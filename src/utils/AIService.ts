import OpenAI from 'openai';
import { Logger } from './Logger';

interface AIAnalysisResult {
  explanation: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  suggestedTags: string[];
}

interface SnippetDetailsResult {
  title: string;
  description: string;
  language: string;
  tags: string[];
  explanation: string;
}

interface OptimizationSuggestion {
  type: 'performance' | 'readability' | 'security' | 'best-practice' | 'bug-fix';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  suggestion: string;
  originalCode: string;
  optimizedCode?: string;
  lineNumber?: number;
}

interface CodeOptimizationResult {
  overallScore: number; // 0-100
  issues: OptimizationSuggestion[];
  summary: string;
  complexity: 'low' | 'medium' | 'high';
  maintainability: 'poor' | 'fair' | 'good' | 'excellent';
}

interface CodeConversionResult {
  convertedCode: string;
  sourceLanguage: string;
  targetLanguage: string;
  conversionNotes: string[];
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
  equivalentLibraries?: { [key: string]: string };
}

interface LanguageFeatureComparison {
  feature: string;
  sourceImplementation: string;
  targetImplementation: string;
  notes: string;
}

export class AIService {
  private openai: OpenAI;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('AIService');
    
    if (!process.env.OPENAI_API_KEY) {
      this.logger.log('OpenAI API key not found in environment variables', 'ERROR');
      throw new Error('OpenAI API key is required');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private parseJSONResponse(content: string): any {
    try {
      // First try to parse as-is
      return JSON.parse(content);
    } catch (error) {
      try {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          return JSON.parse(jsonMatch[1]);
        }
        
        // Try to find JSON object/array in the content
        const jsonObjectMatch = content.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          return JSON.parse(jsonObjectMatch[0]);
        }
        
        const jsonArrayMatch = content.match(/\[[\s\S]*\]/);
        if (jsonArrayMatch) {
          return JSON.parse(jsonArrayMatch[0]);
        }
        
        throw new Error('No valid JSON found in response');
      } catch (parseError) {
        this.logger.log(`Error parsing JSON response: ${parseError}. Content: ${content.substring(0, 200)}...`, 'ERROR');
        throw new Error('Invalid JSON response from AI service');
      }
    }
  }

  async generateSnippetDetails(code: string): Promise<SnippetDetailsResult> {
    try {
      const prompt = `Analyze this code snippet and generate comprehensive details for a code snippet manager. Provide:

1. A concise, descriptive title (max 60 characters)
2. A brief description of what the code does (1-2 sentences)
3. The programming language
4. 3-5 relevant tags
5. A clear explanation of how the code works

Code:
\`\`\`
${code}
\`\`\`

Respond in JSON format:
{
  "title": "title here",
  "description": "description here",
  "language": "language here",
  "tags": ["tag1", "tag2", "tag3"],
  "explanation": "detailed explanation here"
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a code analysis expert. Generate accurate, helpful metadata for code snippets. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const details = this.parseJSONResponse(content);
      
      return {
        title: details.title || 'Code Snippet',
        description: details.description || 'A code snippet',
        language: details.language || 'text',
        tags: Array.isArray(details.tags) ? details.tags : ['code'],
        explanation: details.explanation || 'No explanation available'
      };

    } catch (error) {
      this.logger.log('Error generating snippet details with AI: ' + error, 'ERROR');
      
      // Fallback analysis
      const detectedLanguage = this.detectLanguage(code);
      return {
        title: 'Code Snippet',
        description: 'A code snippet requiring manual review',
        language: detectedLanguage,
        tags: [detectedLanguage, 'code'],
        explanation: 'AI analysis temporarily unavailable'
      };
    }
  }

  private detectLanguage(code: string): string {
    // Simple language detection based on common patterns
    if (code.includes('function') || code.includes('const') || code.includes('let') || code.includes('var')) {
      return 'javascript';
    }
    if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
      return 'python';
    }
    if (code.includes('public class') || code.includes('System.out')) {
      return 'java';
    }
    if (code.includes('#include') || code.includes('int main')) {
      return 'c';
    }
    if (code.includes('<?php') || code.includes('echo ')) {
      return 'php';
    }
    if (code.includes('<html>') || code.includes('<div>')) {
      return 'html';
    }
    if (code.includes('SELECT') || code.includes('FROM') || code.includes('WHERE')) {
      return 'sql';
    }
    return 'text';
  }

  async analyzeCode(code: string, language: string): Promise<AIAnalysisResult> {
    try {
      const prompt = `Analyze this ${language} code snippet and provide:
1. A clear, concise explanation of what the code does (2-3 sentences)
2. Complexity level: beginner, intermediate, or advanced
3. 3-5 relevant tags (comma-separated)

Code:
\`\`\`${language}
${code}
\`\`\`

Respond in JSON format:
{
  "explanation": "explanation here",
  "complexity": "beginner|intermediate|advanced",
  "suggestedTags": ["tag1", "tag2", "tag3"]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a code analysis expert. Provide clear, accurate analysis of code snippets."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const analysis = this.parseJSONResponse(content);
      
      return {
        explanation: analysis.explanation || 'No explanation available',
        complexity: analysis.complexity || 'beginner',
        suggestedTags: analysis.suggestedTags || []
      };

    } catch (error) {
      this.logger.log('Error analyzing code with AI: ' + error, 'ERROR');
      
      // Fallback analysis
      return {
        explanation: 'AI analysis temporarily unavailable',
        complexity: 'beginner',
        suggestedTags: [language.toLowerCase()]
      };
    }
  }

  async explainCode(code: string, language: string): Promise<string> {
    try {
      const prompt = `Explain what this ${language} code does in simple terms. Focus on the main functionality and key concepts:

\`\`\`${language}
${code}
\`\`\``;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful coding tutor. Explain code clearly and concisely for developers of all skill levels."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || 'Unable to generate explanation';

    } catch (error) {
      this.logger.log('Error explaining code with AI: ' + error, 'ERROR');
      return 'AI explanation temporarily unavailable';
    }
  }

  async generateTags(code: string, language: string): Promise<string[]> {
    try {
      const prompt = `Analyze this ${language} code and suggest 3-5 relevant programming tags. Return only comma-separated tags:

\`\`\`${language}
${code}
\`\`\``;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return content.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }

      return [language.toLowerCase()];

    } catch (error) {
      this.logger.log('Error generating tags with AI: ' + error, 'ERROR');
      return [language.toLowerCase()];
    }
  }

  async optimizeCode(code: string, language: string): Promise<CodeOptimizationResult> {
    try {
      const prompt = `Analyze this ${language} code for optimization opportunities. Focus on:
1. Performance improvements
2. Code readability and maintainability
3. Security vulnerabilities
4. Best practices
5. Potential bugs

Provide a comprehensive analysis with specific, actionable suggestions.

Code:
\`\`\`${language}
${code}
\`\`\`

Respond with a detailed JSON analysis:
{
  "overallScore": 85,
  "complexity": "medium",
  "maintainability": "good",
  "summary": "Overall assessment summary",
  "issues": [
    {
      "type": "performance",
      "severity": "medium",
      "title": "Issue title",
      "description": "Detailed description of the issue",
      "suggestion": "How to fix it",
      "originalCode": "problematic code snippet",
      "optimizedCode": "improved code snippet",
      "lineNumber": 5
    }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert code reviewer and optimization specialist. Provide detailed, actionable feedback to improve code quality, performance, and maintainability. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const optimization = this.parseJSONResponse(content);
      
      return {
        overallScore: optimization.overallScore || 75,
        complexity: optimization.complexity || 'medium',
        maintainability: optimization.maintainability || 'fair',
        summary: optimization.summary || 'Code analysis completed',
        issues: optimization.issues || []
      };

    } catch (error) {
      this.logger.log('Error optimizing code with AI: ' + error, 'ERROR');
      
      // Fallback analysis
      return {
        overallScore: 75,
        complexity: 'medium',
        maintainability: 'fair',
        summary: 'AI optimization analysis temporarily unavailable',
        issues: []
      };
    }
  }

  async generateOptimizedVersion(code: string, language: string, focusArea?: string): Promise<string> {
    try {
      const focus = focusArea ? ` Focus specifically on ${focusArea}.` : '';
      const prompt = `Provide an optimized version of this ${language} code.${focus}

Original code:
\`\`\`${language}
${code}
\`\`\`

Return only the optimized code with comments explaining key improvements:`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a code optimization expert. Provide clean, efficient, and well-documented optimized code."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.2,
      });

      return response.choices[0]?.message?.content || 'Unable to generate optimized version';

    } catch (error) {
      this.logger.log('Error generating optimized code: ' + error, 'ERROR');
      return 'AI optimization temporarily unavailable';
    }
  }

  async getSecurityAnalysis(code: string, language: string): Promise<OptimizationSuggestion[]> {
    try {
      const prompt = `Analyze this ${language} code for security vulnerabilities and potential risks:

\`\`\`${language}
${code}
\`\`\`

Focus on:
- Input validation
- SQL injection risks
- XSS vulnerabilities
- Authentication/authorization issues
- Data exposure risks
- Insecure dependencies

Respond with JSON array of security issues:
[
  {
    "type": "security",
    "severity": "high",
    "title": "Security issue title",
    "description": "Detailed description",
    "suggestion": "How to fix it",
    "originalCode": "vulnerable code",
    "optimizedCode": "secure code"
  }
]`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a cybersecurity expert specializing in code security analysis. Identify real security vulnerabilities and provide concrete solutions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.1,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return [];
      }

      const securityIssues = this.parseJSONResponse(content);
      return Array.isArray(securityIssues) ? securityIssues : [];

    } catch (error) {
      this.logger.log('Error analyzing security: ' + error, 'ERROR');
      return [];
    }
  }

  async convertCode(code: string, sourceLanguage: string, targetLanguage: string): Promise<CodeConversionResult> {
    try {
      const prompt = `Convert this ${sourceLanguage} code to ${targetLanguage}. Provide a comprehensive analysis of the conversion.

Source Code (${sourceLanguage}):
\`\`\`${sourceLanguage}
${code}
\`\`\`

Requirements:
1. Convert the code to idiomatic ${targetLanguage}
2. Maintain the same functionality
3. Use appropriate ${targetLanguage} conventions and best practices
4. Identify any features that don't have direct equivalents
5. Suggest equivalent libraries if needed
6. Provide conversion confidence level

Respond with JSON:
{
  "convertedCode": "converted code here",
  "sourceLanguage": "${sourceLanguage}",
  "targetLanguage": "${targetLanguage}",
  "conversionNotes": ["note1", "note2"],
  "confidence": "high|medium|low",
  "warnings": ["warning1", "warning2"],
  "equivalentLibraries": {"sourceLib": "targetLib"}
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an expert polyglot programmer specializing in code conversion between programming languages. You understand the nuances, idioms, and best practices of multiple programming languages. Always provide accurate, idiomatic conversions while noting important differences and potential issues.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const conversion = this.parseJSONResponse(content);
      
      return {
        convertedCode: conversion.convertedCode || 'Conversion failed',
        sourceLanguage: conversion.sourceLanguage || sourceLanguage,
        targetLanguage: conversion.targetLanguage || targetLanguage,
        conversionNotes: conversion.conversionNotes || [],
        confidence: conversion.confidence || 'low',
        warnings: conversion.warnings || [],
        equivalentLibraries: conversion.equivalentLibraries || {}
      };

    } catch (error) {
      this.logger.log('Error converting code: ' + error, 'ERROR');
      
      // Fallback response
      return {
        convertedCode: 'Code conversion temporarily unavailable',
        sourceLanguage,
        targetLanguage,
        conversionNotes: ['AI conversion service temporarily unavailable'],
        confidence: 'low',
        warnings: ['Automatic conversion failed'],
        equivalentLibraries: {}
      };
    }
  }

  async getLanguageFeatureComparison(sourceLanguage: string, targetLanguage: string): Promise<LanguageFeatureComparison[]> {
    try {
      const prompt = `Compare key programming features between ${sourceLanguage} and ${targetLanguage}. Focus on:

1. Syntax differences
2. Data structures
3. Object-oriented concepts
4. Error handling
5. Memory management
6. Concurrency/async patterns
7. Package/module systems
8. Common libraries

Respond with JSON array:
[
  {
    "feature": "Feature name",
    "sourceImplementation": "How it works in ${sourceLanguage}",
    "targetImplementation": "How it works in ${targetLanguage}",
    "notes": "Key differences and considerations"
  }
]`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a programming language expert who provides detailed comparisons between different programming languages, focusing on practical differences developers need to know."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return [];
      }

      const comparison = this.parseJSONResponse(content);
      return Array.isArray(comparison) ? comparison : [];

    } catch (error) {
      this.logger.log('Error getting language comparison: ' + error, 'ERROR');
      return [];
    }
  }
}
