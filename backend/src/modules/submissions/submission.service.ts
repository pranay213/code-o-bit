import { AppError } from '@/types/api';
import { SubmissionDto, CreateSubmissionDto } from '@/types/submission';
import { PaginatedResponse } from '@/types/pagination';
import { submissionRepository } from '@/modules/submissions/submission.repository';
import { problemRepository } from '@/modules/problems/problem.repository';
import { judgeService } from '@/modules/submissions/judge.service';
import { parsePagination, buildPaginationMeta } from '@/utils/pagination';
import { SUBMISSION_STATUS } from '@/constants/submission-status';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { ISubmission } from '@/modules/submissions/submission.model';
import { Language } from '@/constants/languages';
import { SubmissionStatus } from '@/constants/submission-status';

function toSubmissionDto(submission: ISubmission): SubmissionDto {
  const isPopulated = submission.problemId && typeof submission.problemId === 'object' && '_id' in (submission.problemId as any);
  return {
    id: String(submission._id),
    userId: String(submission.userId),
    problemId: isPopulated ? String((submission.problemId as any)._id) : String(submission.problemId),
    problem: isPopulated ? {
      id: String((submission.problemId as any)._id),
      title: (submission.problemId as any).title,
      difficulty: (submission.problemId as any).difficulty
    } : undefined,
    contestId: submission.contestId ? String(submission.contestId) : null,
    language: submission.language as Language,
    code: submission.code,
    status: submission.status as SubmissionStatus,
    executionTime: submission.executionTime,
    memoryUsed: submission.memoryUsed,
    errorMessage: submission.errorMessage,
    passedCases: submission.passedCases ?? undefined,
    totalCases: submission.totalCases ?? undefined,
    score: submission.score ?? undefined,
    testcaseResults: submission.testcaseResults ?? undefined,
    createdAt: submission.createdAt,
  };
}

export const submissionService = {
  async createSubmission(
    userId: string,
    data: CreateSubmissionDto,
  ): Promise<SubmissionDto> {
    const problem = await problemRepository.findById(data.problemId);
    if (!problem) throw new AppError(ERROR_MESSAGES.PROBLEM_NOT_FOUND, 404);

    const submission = await submissionRepository.create({
      userId,
      problemId: data.problemId,
      ...(data.contestId && { contestId: data.contestId }),
      language: data.language,
      code: data.code,
    });

    // Execute code using the real Judge Service
    const judgeResult = await judgeService.evaluateSubmission(data.language, data.code, problem);

    // Calculate score based on time taken if accepted (max 100, min 10)
    let score = 0;
    if (judgeResult.status === SUBMISSION_STATUS.ACCEPTED && data.timeTaken) {
      score = Math.max(10, 100 - Math.floor(data.timeTaken / 10));
    } else if (judgeResult.status === SUBMISSION_STATUS.ACCEPTED) {
      score = 100;
    }

    const finalSubmission = await submissionService.updateSubmissionVerdict(String(submission._id), {
      status: judgeResult.status,
      executionTime: judgeResult.executionTime,
      memoryUsed: judgeResult.memoryUsed,
      errorMessage: judgeResult.errorMessage,
      passedCases: judgeResult.passedCases,
      totalCases: judgeResult.totalCases,
      testcaseResults: judgeResult.testcaseResults,
      score: score > 0 ? score : undefined
    });

    return finalSubmission || toSubmissionDto(submission);
  },

  async getSubmissionById(submissionId: string, requestingUserId: string): Promise<SubmissionDto> {
    const submission = await submissionRepository.findById(submissionId);
    if (!submission) throw new AppError(ERROR_MESSAGES.SUBMISSION_NOT_FOUND, 404);

    if (String(submission.userId) !== requestingUserId) {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, 403);
    }

    return toSubmissionDto(submission);
  },

  async listMySubmissions(
    userId: string,
    query: {
      page?: string;
      limit?: string;
      problemId?: string;
      contestId?: string;
      status?: string;
    },
  ): Promise<PaginatedResponse<SubmissionDto>> {
    const { page, limit, skip } = parsePagination(query);
    const { submissions, total } = await submissionRepository.findByUser(userId, {
      skip,
      limit,
      problemId: query.problemId,
      contestId: query.contestId,
      status: query.status,
    });

    return {
      items: submissions.map(toSubmissionDto),
      meta: buildPaginationMeta(total, page, limit),
    };
  },

  async updateSubmissionVerdict(
    submissionId: string,
    verdict: {
      status: string;
      executionTime?: number;
      memoryUsed?: number;
      errorMessage?: string;
      passedCases?: number;
      totalCases?: number;
      testcaseResults?: any[];
      score?: number;
    },
  ): Promise<SubmissionDto | null> {
    const submission = await submissionRepository.updateStatus(submissionId, verdict);
    if (!submission) return null;

    // Increment solvedCount on the user if newly accepted
    if (verdict.status === SUBMISSION_STATUS.ACCEPTED) {
      const { UserModel } = await import('@/modules/users/user.model');
      await UserModel.findByIdAndUpdate(submission.userId, { $inc: { solvedCount: 1 } }).exec();
    }

    return toSubmissionDto(submission);
  },
};
