import { Request, Response } from 'express';
import { problemService } from '@/modules/problems/problem.service';
import { sendSuccess } from '@/utils/api-response';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';
import {
  CreateProblemInput,
  UpdateProblemInput,
  ProblemListQueryInput,
} from '@/modules/problems/problem.validator';
import { ROLES } from '@/constants/roles';
import { aiGeneratorService } from '@/modules/problems/ai-generator.service';
import { env } from '@/config/env';
import { AppError } from '@/types/api';
import { ERROR_MESSAGES } from '@/constants/error-messages';

export const problemController = {
  async listProblems(req: Request, res: Response): Promise<void> {
    const query = req.query as ProblemListQueryInput;
    const isAdmin = req.user?.role === ROLES.ADMIN;
    const result = await problemService.listProblems(query, isAdmin);
    sendSuccess(res, result.items, SUCCESS_MESSAGES.PROBLEMS_FETCHED, 200, result.meta);
  },

  async getProblem(req: Request, res: Response): Promise<void> {
    const problem = await problemService.getProblemById(req.params['id'] ?? '');
    sendSuccess(res, problem, SUCCESS_MESSAGES.PROBLEM_FETCHED);
  },

  async createProblem(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateProblemInput;
    const problem = await problemService.createProblem(body);
    sendSuccess(res, problem, SUCCESS_MESSAGES.PROBLEM_CREATED, 201);
  },

  async updateProblem(req: Request, res: Response): Promise<void> {
    const body = req.body as UpdateProblemInput;
    const problem = await problemService.updateProblem(req.params['id'] ?? '', body);
    sendSuccess(res, problem, SUCCESS_MESSAGES.PROBLEM_UPDATED);
  },

  async deleteProblem(req: Request, res: Response): Promise<void> {
    await problemService.deleteProblem(req.params['id'] ?? '');
    sendSuccess(res, null, SUCCESS_MESSAGES.PROBLEM_DELETED);
  },

  async generateDailyProblem(req: Request, res: Response): Promise<void> {
    const secret = req.headers['x-cron-secret'] || req.query.secret;
    if (secret !== env.ollamaCronSecret) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }
    const problem = await aiGeneratorService.generateDailyProblem();
    sendSuccess(res, problem, 'Daily problem generated successfully', 201);
  }
};
