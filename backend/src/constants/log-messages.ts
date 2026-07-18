export const LOG_MESSAGES = {
  // Database
  DB_CONNECTED: 'Connected to MongoDB',
  DB_CONNECTION_ERROR: 'Connection error',
  DB_DISCONNECTED: 'Disconnected from MongoDB',
  DB_CONNECT_FAILED: 'Failed to connect to MongoDB',

  // Server
  SERVER_STARTING: 'Starting server...',
  SERVER_RUNNING: 'Server is running',
  SERVER_SWAGGER: 'Swagger docs available',
  SERVER_ENVIRONMENT: 'Environment',
  SERVER_SHUTDOWN_SIGNAL: 'Received shutdown signal',
  SERVER_SHUTTING_DOWN: 'Shutting down gracefully...',
  SERVER_SHUTDOWN_COMPLETE: 'Server shutdown complete',
  SERVER_BOOT_FAILED: 'Failed to start server',

  // Auth middleware
  AUTH_TOKEN_MISSING: 'Access token missing in request',
  AUTH_TOKEN_INVALID: 'Access token invalid or expired',
  AUTH_TOKEN_VERIFIED: 'Access token verified',

  // Request context
  REQUEST_CONTEXT_ATTACHED: 'Request context attached',

  // Audit
  AUDIT_REQUEST_COMPLETED: 'Request completed',
  AUDIT_REQUEST_FAILED: 'Request failed',

  // Env validation
  ENV_INVALID: 'Invalid environment variables detected — aborting startup',
  ENV_LOADED: 'Environment variables validated successfully',
} as const;

export const LOG_COMPONENTS = {
  SERVER: 'server',
  DATABASE: 'database',
  AUTH: 'auth',
  USERS: 'users',
  PROBLEMS: 'problems',
  CONTESTS: 'contests',
  SUBMISSIONS: 'submissions',
  LEADERBOARD: 'leaderboard',
  ADMIN: 'admin',
  AUDIT: 'audit',
  REQUEST: 'request',
} as const;

export type LogComponent = (typeof LOG_COMPONENTS)[keyof typeof LOG_COMPONENTS];
