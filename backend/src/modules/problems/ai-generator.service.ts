import { Ollama } from 'ollama';
import { env } from '@/config/env';
import { problemService } from './problem.service';
import { AppError } from '@/types/api';
import { ERROR_MESSAGES } from '@/constants/error-messages';

const ollama = new Ollama({
  host: 'https://ollama.com',
  headers: {
    Authorization: 'Bearer ' + env.ollamaApiKey,
  },
});

export const aiGeneratorService = {
  async generateDailyProblem() {
    if (!env.ollamaApiKey) {
      throw new AppError('OLLAMA_API_KEY is not configured', 500);
    }

    const prompt = `You are an expert competitive programming problem creator. 
Create a new, unique programming problem involving algorithms or data structures.
Return the result STRICTLY as a valid JSON object. Do not return any markdown formatting like \`\`\`json or any conversational text.

The JSON MUST match this exact schema:
{
  "title": "String - A unique and engaging problem title",
  "description": "String - A detailed problem description, including constraints and input/output formats.",
  "difficulty": "String - Exactly one of 'easy', 'medium', or 'hard'",
  "tags": ["String - Relevant tags like 'math', 'array', 'dynamic programming'"],
  "testCases": [
    { 
      "input": "String - The precise standard input to feed to the program", 
      "expectedOutput": "String - The exact expected standard output", 
      "isPublic": true 
    }
  ]
}

Constraints:
1. Generate exactly 5 testcases.
2. At least 2 testcases must be public.
3. The "input" and "expectedOutput" should be plain string representations of the data separated by spaces or newlines as typically read from stdin.
4. ONLY return valid JSON.`;

    const response = await ollama.chat({
      model: 'gpt-oss:120b',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    });

    let content = response.message.content.trim();
    
    // Clean up markdown wrapping if the model ignored instructions
    if (content.startsWith('```json')) {
      content = content.replace(/^```json/, '');
      if (content.endsWith('```')) {
        content = content.substring(0, content.length - 3);
      }
    }
    
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse Ollama output as JSON:', content);
      throw new AppError('Failed to parse AI generated problem as JSON', 500);
    }

    // Default time and memory limits
    const problemInput = {
      title: parsed.title,
      description: parsed.description,
      difficulty: parsed.difficulty,
      tags: parsed.tags || [],
      timeLimit: 2000,
      memoryLimit: 256,
      testCases: parsed.testCases,
      isPublished: true, 
    };

    // Save using the existing problem service
    const problem = await problemService.createProblem(problemInput as any);
    return problem;
  }
};
