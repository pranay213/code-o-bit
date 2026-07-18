import { FilterQuery } from 'mongoose';
import { ContestModel, IContest } from '@/modules/contests/contest.model';

export const contestRepository = {
  async findAll(options: {
    skip: number;
    limit: number;
    status?: string;
  }): Promise<{ contests: IContest[]; total: number }> {
    const query: FilterQuery<IContest> = {};
    if (options.status) query.status = options.status;

    const [contests, total] = await Promise.all([
      ContestModel.find(query)
        .select('-participants')
        .skip(options.skip)
        .limit(options.limit)
        .sort({ startTime: -1 })
        .exec(),
      ContestModel.countDocuments(query).exec(),
    ]);

    return { contests, total };
  },

  async findById(id: string): Promise<IContest | null> {
    return ContestModel.findById(id).exec();
  },

  async findBySlug(slug: string): Promise<IContest | null> {
    return ContestModel.findOne({ slug }).exec();
  },

  async create(data: {
    slug: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    problems: Array<{ problemId: string; order: number; points: number }>;
  }): Promise<IContest> {
    const contest = new ContestModel(data);
    return contest.save();
  },

  async updateById(id: string, data: Partial<IContest>): Promise<IContest | null> {
    return ContestModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec();
  },

  async deleteById(id: string): Promise<IContest | null> {
    return ContestModel.findByIdAndDelete(id).exec();
  },

  async addParticipant(contestId: string, userId: string): Promise<IContest | null> {
    return ContestModel.findByIdAndUpdate(
      contestId,
      { $addToSet: { participants: userId } },
      { new: true },
    ).exec();
  },

  async isParticipant(contestId: string, userId: string): Promise<boolean> {
    const contest = await ContestModel.findOne({
      _id: contestId,
      participants: userId,
    })
      .select('_id')
      .exec();
    return !!contest;
  },
};
