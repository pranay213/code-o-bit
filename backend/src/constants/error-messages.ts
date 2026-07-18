export const ERROR_MESSAGES = {
  // Generic
  INTERNAL_SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  ROUTE_NOT_FOUND: 'Route not found.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  VALIDATION_FAILED: 'Validation failed. Please check your input.',
  INVALID_ID: 'The provided ID is invalid.',

  // Auth
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  USERNAME_TAKEN: 'Username is already taken.',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token.',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found.',
  ACCESS_TOKEN_EXPIRED: 'Access token has expired.',
  ACCESS_TOKEN_MISSING: 'Access token is missing.',
  ACCESS_TOKEN_INVALID: 'Access token is invalid.',

  // User
  USER_NOT_FOUND: 'User not found.',
  CANNOT_DELETE_OWN_ACCOUNT: 'You cannot delete your own account.',
  CANNOT_CHANGE_OWN_ROLE: 'You cannot change your own role.',

  // Problem
  PROBLEM_NOT_FOUND: 'Problem not found.',
  PROBLEM_SLUG_TAKEN: 'A problem with this slug already exists.',

  // Contest
  CONTEST_NOT_FOUND: 'Contest not found.',
  CONTEST_SLUG_TAKEN: 'A contest with this slug already exists.',
  CONTEST_ALREADY_STARTED: 'The contest has already started and cannot be modified.',
  CONTEST_REGISTRATION_CLOSED: 'Contest registration is not open.',
  ALREADY_REGISTERED: 'You are already registered for this contest.',

  // Submission
  SUBMISSION_NOT_FOUND: 'Submission not found.',
  PROBLEM_NOT_IN_CONTEST: 'This problem is not part of the specified contest.',
} as const;
