import { FilterQuery } from 'mongoose';
import { SubmissionModel, ISubmission } from '@/modules/submissions/submission.model';

export const submissionRepository = {
  async create(data: {
    userId: string;
    problemId: string;
    contestId?: string;
    language: string;
    code: string;
  }): Promise<ISubmission> {
    const submission = new SubmissionModel(data);
    return submission.save();
  },

  async findById(id: string): Promise<ISubmission | null> {
    return SubmissionModel.findById(id).exec();
  },

  async findByUser(
    userId: string,
    options: {
      skip: number;
      limit: number;
      problemId?: string;
      contestId?: string;
      status?: string;
    },
  ): Promise<{ submissions: ISubmission[]; total: number }> {
    const query: FilterQuery<ISubmission> = { userId };

    if (options.problemId) query.problemId = options.problemId;
    if (options.contestId) query.contestId = options.contestId;
    if (options.status) query.status = options.status;

    const [submissions, total] = await Promise.all([
      SubmissionModel.find(query)
        .select('-code')
        .populate('problemId', 'title difficulty')
        .sort({ createdAt: -1 })
        .skip(options.skip)
        .limit(options.limit)
        .exec(),
      SubmissionModel.countDocuments(query).exec(),
    ]);

    return { submissions, total };
  },

  async updateStatus(
    id: string,
    data: {
      status: string;
      executionTime?: number;
      memoryUsed?: number;
      errorMessage?: string;
    },
  ): Promise<ISubmission | null> {
    return SubmissionModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  },
};
