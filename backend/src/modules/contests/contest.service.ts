import { AppError } from '@/types/api';
import { ContestDto, CreateContestDto, UpdateContestDto, ContestStandingEntry } from '@/types/contest';
import { PaginatedResponse } from '@/types/pagination';
import { contestRepository } from '@/modules/contests/contest.repository';
import { parsePagination, buildPaginationMeta } from '@/utils/pagination';
import { CONTEST_STATUS } from '@/constants/contest-status';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { IContest } from '@/modules/contests/contest.model';
import { SubmissionModel } from '@/modules/submissions/submission.model';
import { SUBMISSION_STATUS } from '@/constants/submission-status';
import { UserModel } from '@/modules/users/user.model';

function toContestDto(contest: IContest): ContestDto {
  return {
    id: String(contest._id),
    slug: contest.slug,
    title: contest.title,
    description: contest.description,
    startTime: contest.startTime,
    endTime: contest.endTime,
    status: contest.status as ContestDto['status'],
    problems: contest.problems.map((p) => ({
      problemId: String(p.problemId),
      order: p.order,
      points: p.points,
    })),
    participantCount: contest.participants?.length ?? 0,
    createdAt: contest.createdAt,
    updatedAt: contest.updatedAt,
  };
}

function computeContestStatus(startTime: Date, endTime: Date): string {
  const now = new Date();
  if (now < startTime) return CONTEST_STATUS.UPCOMING;
  if (now > endTime) return CONTEST_STATUS.ENDED;
  return CONTEST_STATUS.ONGOING;
}

export const contestService = {
  async listContests(query: {
    page?: string;
    limit?: string;
    status?: string;
  }): Promise<PaginatedResponse<ContestDto>> {
    const { page, limit, skip } = parsePagination(query);
    const { contests, total } = await contestRepository.findAll({ skip, limit, status: query.status });

    return {
      items: contests.map(toContestDto),
      meta: buildPaginationMeta(total, page, limit),
    };
  },

  async getContestById(id: string): Promise<ContestDto> {
    const contest = await contestRepository.findById(id);
    if (!contest) throw new AppError(ERROR_MESSAGES.CONTEST_NOT_FOUND, 404);
    return toContestDto(contest);
  },

  async createContest(data: CreateContestDto): Promise<ContestDto> {
    const existing = await contestRepository.findBySlug(data.slug);
    if (existing) throw new AppError('A contest with this slug already exists.', 409);

    const contest = await contestRepository.create({
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    });
    return toContestDto(contest);
  },

  async updateContest(id: string, data: UpdateContestDto): Promise<ContestDto> {
    const existing = await contestRepository.findById(id);
    if (!existing) throw new AppError(ERROR_MESSAGES.CONTEST_NOT_FOUND, 404);

    const currentStatus = computeContestStatus(existing.startTime, existing.endTime);
    if (currentStatus === CONTEST_STATUS.ONGOING) {
      throw new AppError(ERROR_MESSAGES.CONTEST_ALREADY_STARTED, 400);
    }

    const updated = await contestRepository.updateById(id, data as Partial<IContest>);
    if (!updated) throw new AppError(ERROR_MESSAGES.CONTEST_NOT_FOUND, 404);

    return toContestDto(updated);
  },

  async deleteContest(id: string): Promise<void> {
    const contest = await contestRepository.deleteById(id);
    if (!contest) throw new AppError(ERROR_MESSAGES.CONTEST_NOT_FOUND, 404);
  },

  async registerForContest(contestId: string, userId: string): Promise<void> {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw new AppError(ERROR_MESSAGES.CONTEST_NOT_FOUND, 404);

    const status = computeContestStatus(contest.startTime, contest.endTime);
    if (status !== CONTEST_STATUS.UPCOMING) {
      throw new AppError(ERROR_MESSAGES.CONTEST_REGISTRATION_CLOSED, 400);
    }

    const alreadyRegistered = await contestRepository.isParticipant(contestId, userId);
    if (alreadyRegistered) {
      throw new AppError(ERROR_MESSAGES.ALREADY_REGISTERED, 409);
    }

    await contestRepository.addParticipant(contestId, userId);
  },

  async getContestStandings(contestId: string): Promise<ContestStandingEntry[]> {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw new AppError(ERROR_MESSAGES.CONTEST_NOT_FOUND, 404);

    const problemIds = contest.problems.map((p) => p.problemId);
    const pointsMap = new Map(contest.problems.map((p) => [String(p.problemId), p.points]));

    // Fetch all accepted submissions for this contest
    const acceptedSubmissions = await SubmissionModel.find({
      contestId,
      problemId: { $in: problemIds },
      status: SUBMISSION_STATUS.ACCEPTED,
    })
      .sort({ createdAt: 1 })
      .select('userId problemId createdAt')
      .exec();

    // Aggregate points per user (first accepted submission per problem counts)
    const userPoints = new Map<string, { totalPoints: number; solvedProblems: Set<string> }>();

    for (const submission of acceptedSubmissions) {
      const uid = String(submission.userId);
      const pid = String(submission.problemId);

      if (!userPoints.has(uid)) {
        userPoints.set(uid, { totalPoints: 0, solvedProblems: new Set() });
      }

      const entry = userPoints.get(uid)!;
      if (!entry.solvedProblems.has(pid)) {
        entry.solvedProblems.add(pid);
        entry.totalPoints += pointsMap.get(pid) ?? 0;
      }
    }

    const userIds = [...userPoints.keys()];
    const users = await UserModel.find({ _id: { $in: userIds } })
      .select('username')
      .exec();
    const usernameMap = new Map(users.map((u) => [String(u._id), u.username]));

    const standings: ContestStandingEntry[] = [...userPoints.entries()]
      .map(([userId, data]) => ({
        rank: 0,
        userId,
        username: usernameMap.get(userId) ?? 'Unknown',
        totalPoints: data.totalPoints,
        solvedCount: data.solvedProblems.size,
        totalPenalty: 0,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints || b.solvedCount - a.solvedCount);

    standings.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return standings;
  },
};
