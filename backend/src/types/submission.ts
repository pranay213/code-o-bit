import { Language } from '@/constants/languages';
import { SubmissionStatus } from '@/constants/submission-status';

export interface SubmissionDto {
  id: string;
  userId: string;
  problemId: string;
  problem?: { id: string; title: string; difficulty: string };
  contestId: string | null;
  language: Language;
  code: string;
  status: SubmissionStatus;
  executionTime: number | null;
  memoryUsed: number | null;
  errorMessage: string | null;
  passedCases?: number;
  totalCases?: number;
  score?: number;
  createdAt: Date;
}

export interface CreateSubmissionDto {
  problemId: string;
  contestId?: string;
  language: Language;
  code: string;
  timeTaken?: number;
}

export interface SubmissionListQuery {
  page?: number;
  limit?: number;
  problemId?: string;
  contestId?: string;
  status?: SubmissionStatus;
}
