import { Request, Response } from 'express';
import { contestService } from '@/modules/contests/contest.service';
import { sendSuccess } from '@/utils/api-response';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';
import { AppError } from '@/types/api';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { UpdateContestDto } from '@/types/contest';
import {
  CreateContestInput,
  UpdateContestInput,
  ContestListQueryInput,
} from '@/modules/contests/contest.validator';

export const contestController = {
  async listContests(req: Request, res: Response): Promise<void> {
    const query = req.query as ContestListQueryInput;
    const result = await contestService.listContests(query);
    sendSuccess(res, result.items, SUCCESS_MESSAGES.CONTESTS_FETCHED, 200, result.meta);
  },

  async getContest(req: Request, res: Response): Promise<void> {
    const contest = await contestService.getContestById(req.params['id'] ?? '');
    sendSuccess(res, contest, SUCCESS_MESSAGES.CONTEST_FETCHED);
  },

  async createContest(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateContestInput;
    const contest = await contestService.createContest({
      ...body,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    });
    sendSuccess(res, contest, SUCCESS_MESSAGES.CONTEST_CREATED, 201);
  },

  async updateContest(req: Request, res: Response): Promise<void> {
    const body = req.body as UpdateContestInput;
    const updateData: UpdateContestDto = {
      ...(body.title && { title: body.title }),
      ...(body.description && { description: body.description }),
      ...(body.startTime && { startTime: new Date(body.startTime) }),
      ...(body.endTime && { endTime: new Date(body.endTime) }),
      ...(body.problems && {
        problems: body.problems.map((p) => ({
          problemId: p.problemId,
          order: p.order,
          points: p.points,
        })),
      }),
    };
    const contest = await contestService.updateContest(req.params['id'] ?? '', updateData);
    sendSuccess(res, contest, SUCCESS_MESSAGES.CONTEST_UPDATED);
  },

  async deleteContest(req: Request, res: Response): Promise<void> {
    await contestService.deleteContest(req.params['id'] ?? '');
    sendSuccess(res, null, SUCCESS_MESSAGES.CONTEST_DELETED);
  },

  async registerForContest(req: Request, res: Response): Promise<void> {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
    await contestService.registerForContest(req.params['id'] ?? '', userId);
    sendSuccess(res, null, SUCCESS_MESSAGES.CONTEST_REGISTERED);
  },

  async getContestStandings(req: Request, res: Response): Promise<void> {
    const standings = await contestService.getContestStandings(req.params['id'] ?? '');
    sendSuccess(res, standings, SUCCESS_MESSAGES.CONTEST_STANDINGS_FETCHED);
  },
};
