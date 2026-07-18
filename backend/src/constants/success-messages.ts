export const SUCCESS_MESSAGES = {
  // Auth
  REGISTERED: 'Account created successfully.',
  LOGGED_IN: 'Logged in successfully.',
  LOGGED_OUT: 'Logged out successfully.',
  TOKEN_REFRESHED: 'Access token refreshed successfully.',

  // User
  PROFILE_FETCHED: 'Profile retrieved successfully.',
  PUBLIC_PROFILE_FETCHED: 'User profile retrieved successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  USER_DELETED: 'User deleted successfully.',
  ROLE_UPDATED: 'User role updated successfully.',

  // Problem
  PROBLEMS_FETCHED: 'Problems retrieved successfully.',
  PROBLEM_FETCHED: 'Problem retrieved successfully.',
  PROBLEM_CREATED: 'Problem created successfully.',
  PROBLEM_UPDATED: 'Problem updated successfully.',
  PROBLEM_DELETED: 'Problem deleted successfully.',

  // Contest
  CONTESTS_FETCHED: 'Contests retrieved successfully.',
  CONTEST_FETCHED: 'Contest retrieved successfully.',
  CONTEST_CREATED: 'Contest created successfully.',
  CONTEST_UPDATED: 'Contest updated successfully.',
  CONTEST_DELETED: 'Contest deleted successfully.',
  CONTEST_REGISTERED: 'Registered for the contest successfully.',
  CONTEST_STANDINGS_FETCHED: 'Contest standings retrieved successfully.',

  // Submission
  SUBMISSIONS_FETCHED: 'Submissions retrieved successfully.',
  SUBMISSION_FETCHED: 'Submission retrieved successfully.',
  SUBMISSION_CREATED: 'Code submitted successfully.',

  // Leaderboard
  LEADERBOARD_FETCHED: 'Leaderboard retrieved successfully.',

  // Admin
  USERS_FETCHED: 'Users retrieved successfully.',

  // Health
  SERVICE_HEALTHY: 'Service is healthy.',
} as const;
