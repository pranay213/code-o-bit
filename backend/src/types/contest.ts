import { ContestStatus } from '@/constants/contest-status';

export interface ContestProblem {
  problemId: string;
  order: number;
  points: number;
}

export interface ContestDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: ContestStatus;
  problems: ContestProblem[];
  participantCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContestDto {
  slug: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  problems: ContestProblem[];
}

export interface UpdateContestDto {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  problems?: ContestProblem[];
}

export interface ContestStandingEntry {
  rank: number;
  userId: string;
  username: string;
  totalPoints: number;
  solvedCount: number;
  totalPenalty: number;
}
