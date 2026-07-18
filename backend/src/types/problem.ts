import { Difficulty } from '@/constants/difficulty';

export interface TestCase {
  input: string;
  expectedOutput: string;
  isPublic: boolean;
}

export interface ProblemDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  testCases: TestCase[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  prevId?: string;
  nextId?: string;
}

export interface CreateProblemDto {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  testCases: TestCase[];
  isPublished?: boolean;
}

export interface UpdateProblemDto {
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  tags?: string[];
  timeLimit?: number;
  memoryLimit?: number;
  testCases?: TestCase[];
  isPublished?: boolean;
}

export interface ProblemListQuery {
  page?: number;
  limit?: number;
  difficulty?: Difficulty;
  tag?: string;
  search?: string;
}
