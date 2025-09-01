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
      const details = JSON.parse(content);
      
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
      const analysis = JSON.parse(content);
      
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
}
