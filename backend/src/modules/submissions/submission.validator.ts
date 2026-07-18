import { z } from 'zod';
import { LANGUAGES } from '@/constants/languages';
import { SUBMISSION_STATUS } from '@/constants/submission-status';

export const createSubmissionSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
  contestId: z.string().optional(),
  language: z.enum(
    Object.values(LANGUAGES) as [string, ...string[]],
    { errorMap: () => ({ message: 'Unsupported language' }) },
  ),
  code: z.string().min(1, 'Code is required').max(65536, 'Code is too long'),
  timeTaken: z.number().optional(),
});

export const submissionListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  problemId: z.string().optional(),
  contestId: z.string().optional(),
  status: z.enum(Object.values(SUBMISSION_STATUS) as [string, ...string[]]).optional(),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type SubmissionListQueryInput = z.infer<typeof submissionListQuerySchema>;
