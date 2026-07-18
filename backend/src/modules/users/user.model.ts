import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  bio: string;
  avatarUrl: string;
  country: string;
  solvedCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    solvedCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 1200,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ solvedCount: -1 });
userSchema.index({ rating: -1 });

export const UserModel = model<IUser>('User', userSchema);
