import { z } from 'zod';

const contestProblemSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
  order: z.number().int().min(1),
  points: z.number().int().min(0).default(100),
});

export const createContestSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  startTime: z.string().datetime({ message: 'startTime must be a valid ISO 8601 datetime' }),
  endTime: z.string().datetime({ message: 'endTime must be a valid ISO 8601 datetime' }),
  problems: z.array(contestProblemSchema).default([]),
});

export const updateContestSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  problems: z.array(contestProblemSchema).optional(),
});

export const contestListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(['upcoming', 'ongoing', 'ended']).optional(),
});

export type CreateContestInput = z.infer<typeof createContestSchema>;
export type UpdateContestInput = z.infer<typeof updateContestSchema>;
export type ContestListQueryInput = z.infer<typeof contestListQuerySchema>;
