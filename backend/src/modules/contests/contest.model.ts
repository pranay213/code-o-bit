import { Schema, model, Document } from 'mongoose';
import { CONTEST_STATUS } from '@/constants/contest-status';

export interface IContestProblem {
  problemId: Schema.Types.ObjectId;
  order: number;
  points: number;
}

export interface IContest extends Document {
  slug: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: string;
  problems: IContestProblem[];
  participants: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const contestProblemSchema = new Schema<IContestProblem>(
  {
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    order: { type: Number, required: true },
    points: { type: Number, required: true, default: 100 },
  },
  { _id: false },
);

const contestSchema = new Schema<IContest>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(CONTEST_STATUS),
      default: CONTEST_STATUS.UPCOMING,
    },
    problems: [contestProblemSchema],
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

contestSchema.index({ slug: 1 });
contestSchema.index({ status: 1 });
contestSchema.index({ startTime: 1, endTime: 1 });

export const ContestModel = model<IContest>('Contest', contestSchema);
