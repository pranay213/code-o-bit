import { FilterQuery } from 'mongoose';
import { ProblemModel, IProblem } from '@/modules/problems/problem.model';
import { CreateProblemDto, UpdateProblemDto } from '@/types/problem';
import { MongoQueryOptions } from '@/utils/query-builder';

export const problemRepository = {
  async findAll(options: MongoQueryOptions<IProblem>): Promise<{ problems: IProblem[]; total: number }> {
    const [problems, total] = await Promise.all([
      ProblemModel.find(options.filter)
        .select('-testCases')
        .sort(options.sort as any)
        .skip(options.skip)
        .limit(options.limit)
        .exec(),
      ProblemModel.countDocuments(options.filter).exec(),
    ]);

    return { problems, total };
  },

  async findById(id: string): Promise<IProblem | null> {
    return ProblemModel.findById(id).exec();
  },

  async findBySlug(slug: string): Promise<IProblem | null> {
    return ProblemModel.findOne({ slug }).exec();
  },

  async create(data: CreateProblemDto): Promise<IProblem> {
    const problem = new ProblemModel(data);
    return problem.save();
  },

  async updateById(id: string, data: UpdateProblemDto): Promise<IProblem | null> {
    return ProblemModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec();
  },

  async deleteById(id: string): Promise<IProblem | null> {
    return ProblemModel.findByIdAndDelete(id).exec();
  },
};
