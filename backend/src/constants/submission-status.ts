export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  WRONG_ANSWER: 'wrong_answer',
  TIME_LIMIT_EXCEEDED: 'time_limit_exceeded',
  MEMORY_LIMIT_EXCEEDED: 'memory_limit_exceeded',
  RUNTIME_ERROR: 'runtime_error',
  COMPILATION_ERROR: 'compilation_error',
  INTERNAL_ERROR: 'internal_error',
} as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];
