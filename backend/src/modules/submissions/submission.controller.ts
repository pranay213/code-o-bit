import { Request, Response } from 'express';
import { submissionService } from '@/modules/submissions/submission.service';
import { sendSuccess } from '@/utils/api-response';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';
import { AppError } from '@/types/api';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { CreateSubmissionInput, SubmissionListQueryInput } from '@/modules/submissions/submission.validator';
import { Language } from '@/constants/languages';

export const submissionController = {
  async createSubmission(req: Request, res: Response): Promise<void> {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

    const body = req.body as CreateSubmissionInput;
    const submission = await submissionService.createSubmission(userId, {
      problemId: body.problemId,
      contestId: body.contestId,
      language: body.language as Language,
      code: body.code,
      timeTaken: body.timeTaken,
    });

    sendSuccess(res, submission, SUCCESS_MESSAGES.SUBMISSION_CREATED, 201);
  },

  async getSubmission(req: Request, res: Response): Promise<void> {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

    const submission = await submissionService.getSubmissionById(req.params['id'] ?? '', userId);
    sendSuccess(res, submission, SUCCESS_MESSAGES.SUBMISSION_FETCHED);
  },

  async listMySubmissions(req: Request, res: Response): Promise<void> {
    const userId = req.user?.sub;
    if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

    const query = req.query as SubmissionListQueryInput;
    const result = await submissionService.listMySubmissions(userId, query);
    sendSuccess(res, result.items, SUCCESS_MESSAGES.SUBMISSIONS_FETCHED, 200, result.meta);
  },
};
