import { AppError } from '@/types/api';
import { ProblemDto, CreateProblemDto, UpdateProblemDto } from '@/types/problem';
import { PaginatedResponse } from '@/types/pagination';
import { problemRepository } from '@/modules/problems/problem.repository';
import { buildPaginationMeta } from '@/utils/pagination';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { IProblem, ProblemModel } from '@/modules/problems/problem.model';
import { Difficulty } from '@/constants/difficulty';
import { buildMongoQuery, BaseQueryInput } from '@/utils/query-builder';

function toProblemDto(problem: IProblem): ProblemDto {
  return {
    id: String(problem._id),
    slug: problem.slug,
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty as Difficulty,
    tags: problem.tags,
    timeLimit: problem.timeLimit,
    memoryLimit: problem.memoryLimit,
    testCases: problem.testCases,
    isPublished: problem.isPublished,
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt,
  };
}

export const problemService = {
  async listProblems(
    query: BaseQueryInput,
    isAdmin: boolean,
  ): Promise<PaginatedResponse<ProblemDto>> {
    
    // Parse URL queries into a MongoDB configuration
    const queryOptions = buildMongoQuery<IProblem>(query, ['difficulty', 'tags']);
    
    // Admins see all; normal users only see published
    if (!isAdmin) {
      queryOptions.filter.isPublished = true;
    }

    const { problems, total } = await problemRepository.findAll(queryOptions);

    // Calculate original page variables for pagination meta
    const page = Math.floor(queryOptions.skip / queryOptions.limit) + 1;

    return {
      items: problems.map(toProblemDto),
      meta: buildPaginationMeta(total, page, queryOptions.limit),
    };
  },

  async getProblemById(id: string): Promise<ProblemDto> {
    const problem = await problemRepository.findById(id);
    if (!problem) throw new AppError(ERROR_MESSAGES.PROBLEM_NOT_FOUND, 404);
    
    const dto = toProblemDto(problem);
    
    const nextProblem = await ProblemModel.findOne({ _id: { $gt: problem._id }, isPublished: true }).sort({ _id: 1 }).select('_id');
    const prevProblem = await ProblemModel.findOne({ _id: { $lt: problem._id }, isPublished: true }).sort({ _id: -1 }).select('_id');
    
    if (nextProblem) dto.nextId = String(nextProblem._id);
    if (prevProblem) dto.prevId = String(prevProblem._id);
    
    return dto;
  },

  async createProblem(data: CreateProblemDto): Promise<ProblemDto> {
    const existing = await problemRepository.findBySlug(data.slug);
    if (existing) throw new AppError(ERROR_MESSAGES.PROBLEM_SLUG_TAKEN, 409);

    const problem = await problemRepository.create(data);
    return toProblemDto(problem);
  },

  async updateProblem(id: string, data: UpdateProblemDto): Promise<ProblemDto> {
    const problem = await problemRepository.updateById(id, data);
    if (!problem) throw new AppError(ERROR_MESSAGES.PROBLEM_NOT_FOUND, 404);
    return toProblemDto(problem);
  },

  async deleteProblem(id: string): Promise<void> {
    const problem = await problemRepository.deleteById(id);
    if (!problem) throw new AppError(ERROR_MESSAGES.PROBLEM_NOT_FOUND, 404);
  },
};
