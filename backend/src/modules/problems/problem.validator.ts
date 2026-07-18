import { z } from 'zod';
import { DIFFICULTY } from '@/constants/difficulty';

const testCaseSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  expectedOutput: z.string().min(1, 'Expected output is required'),
  isPublic: z.boolean().default(false),
});

export const createProblemSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  difficulty: z.enum([DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD]),
  tags: z.array(z.string().trim().min(1)).max(10).default([]),
  timeLimit: z.number().int().min(100).max(10000).default(1000),
  memoryLimit: z.number().int().min(16).max(1024).default(256),
  testCases: z.array(testCaseSchema).min(1, 'At least one test case is required'),
  isPublished: z.boolean().default(false),
});

export const updateProblemSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  difficulty: z.enum([DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD]).optional(),
  tags: z.array(z.string().trim().min(1)).max(10).optional(),
  timeLimit: z.number().int().min(100).max(10000).optional(),
  memoryLimit: z.number().int().min(16).max(1024).optional(),
  testCases: z.array(testCaseSchema).min(1).optional(),
  isPublished: z.boolean().optional(),
});

export const problemListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  difficulty: z.enum([DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD]).optional(),
  tags: z.string().optional(),
  search: z.string().optional(),
});

export type CreateProblemInput = z.infer<typeof createProblemSchema>;
export type UpdateProblemInput = z.infer<typeof updateProblemSchema>;
export type ProblemListQueryInput = z.infer<typeof problemListQuerySchema>;
