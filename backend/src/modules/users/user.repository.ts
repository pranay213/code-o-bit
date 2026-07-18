import { UserModel, IUser } from '@/modules/users/user.model';
import { UpdateProfileDto } from '@/types/user';

export const userRepository = {
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).select('-passwordHash').exec();
  },

  async findByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username }).select('-passwordHash').exec();
  },

  async updateById(id: string, data: UpdateProfileDto): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .select('-passwordHash')
      .exec();
  },

  async updateRole(id: string, role: string): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, { $set: { role } }, { new: true })
      .select('-passwordHash')
      .exec();
  },

  async deleteById(id: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(id).exec();
  },

  async findAll(options: { skip: number; limit: number }): Promise<{ users: IUser[]; total: number }> {
    const [users, total] = await Promise.all([
      UserModel.find().select('-passwordHash').skip(options.skip).limit(options.limit).exec(),
      UserModel.countDocuments().exec(),
    ]);
    return { users, total };
  },
};
