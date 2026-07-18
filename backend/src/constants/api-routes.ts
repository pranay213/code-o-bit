export const API_ROUTES = {
  HEALTH: '/health',
  DOCS: '/docs',

  AUTH: {
    BASE: '/auth',
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },

  USERS: {
    BASE: '/users',
    ME: '/users/me',
    BY_ID: '/users/:id',
  },

  PROBLEMS: {
    BASE: '/problems',
    BY_ID: '/problems/:id',
    SUBMISSIONS_BY_PROBLEM: '/problems/:id/submissions',
  },

  CONTESTS: {
    BASE: '/contests',
    BY_ID: '/contests/:id',
    REGISTER: '/contests/:id/register',
    STANDINGS: '/contests/:id/standings',
  },

  SUBMISSIONS: {
    BASE: '/submissions',
    BY_ID: '/submissions/:id',
  },

  LEADERBOARD: {
    BASE: '/leaderboard',
  },

  ADMIN: {
    BASE: '/admin',
    USERS: '/admin/users',
    USER_ROLE: '/admin/users/:id/role',
    USER_BY_ID: '/admin/users/:id',
  },
} as const;
