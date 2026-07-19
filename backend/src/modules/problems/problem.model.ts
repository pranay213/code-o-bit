import { Schema, model, Document } from 'mongoose';
import { DIFFICULTY } from '@/constants/difficulty';

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isPublic: boolean;
}

export interface IProblem extends Document {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  testCases: ITestCase[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testCaseSchema = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
  },
  { _id: false },
);

const problemSchema = new Schema<IProblem>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: Object.values(DIFFICULTY),
      required: true,
    },
    tags: [{ type: String, trim: true }],
    timeLimit: {
      type: Number,
      required: true,
      default: 1000,
      min: 100,
      max: 10000,
    },
    memoryLimit: {
      type: Number,
      required: true,
      default: 256,
      min: 16,
      max: 1024,
    },
    testCases: [testCaseSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ isPublished: 1 });
problemSchema.index({ title: 'text', description: 'text' });

export const ProblemModel = model<IProblem>('Problem', problemSchema);
