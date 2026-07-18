import { Schema, model, Document } from 'mongoose';
import { SUBMISSION_STATUS } from '@/constants/submission-status';
import { LANGUAGES } from '@/constants/languages';

export interface ISubmission extends Document {
  userId: Schema.Types.ObjectId;
  problemId: Schema.Types.ObjectId;
  contestId: Schema.Types.ObjectId | null;
  language: string;
  code: string;
  status: string;
  executionTime: number | null;
  memoryUsed: number | null;
  errorMessage: string | null;
  passedCases: number | null;
  totalCases: number | null;
  score: number | null;
  createdAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    contestId: { type: Schema.Types.ObjectId, ref: 'Contest', default: null },
    language: {
      type: String,
      enum: Object.values(LANGUAGES),
      required: true,
    },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(SUBMISSION_STATUS),
      default: SUBMISSION_STATUS.PENDING,
    },
    executionTime: { type: Number, default: null },
    memoryUsed: { type: Number, default: null },
    errorMessage: { type: String, default: null },
    passedCases: { type: Number, default: null },
    totalCases: { type: Number, default: null },
    score: { type: Number, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

submissionSchema.index({ userId: 1, createdAt: -1 });
submissionSchema.index({ problemId: 1, userId: 1 });
submissionSchema.index({ contestId: 1, userId: 1 });
submissionSchema.index({ status: 1 });

export const SubmissionModel = model<ISubmission>('Submission', submissionSchema);
