import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import chalk from 'chalk';
import path from 'path';
import { LOG_COMPONENTS, LogComponent } from '@/constants/log-messages';

// ─── Log levels ───────────────────────────────────────────────────────────────

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

// ─── Per-component level overrides (configurable via env) ─────────────────────

const COMPONENT_LEVELS: Record<LogComponent, LogLevel> = {
  server: 'info',
  database: 'info',
  auth: 'debug',
  users: 'info',
  problems: 'info',
  contests: 'info',
  submissions: 'info',
  leaderboard: 'info',
  admin: 'info',
  audit: 'http',
  request: 'http',
};

// ─── Chalk colors per level ───────────────────────────────────────────────────

const LEVEL_COLORS: Record<LogLevel, (s: string) => string> = {
  error: chalk.bold.red,
  warn: chalk.bold.yellow,
  info: chalk.bold.cyan,
  http: chalk.bold.magenta,
  debug: chalk.white,
};

const METHOD_COLORS: Record<string, (s: string) => string> = {
  GET: chalk.bold.green,
  POST: chalk.bold.blue,
  PATCH: chalk.bold.yellow,
  PUT: chalk.bold.yellow,
  DELETE: chalk.bold.red,
};

const STATUS_COLOR = (status: number): ((s: string) => string) => {
  if (status >= 500) return chalk.bold.red;
  if (status >= 400) return chalk.yellow;
  if (status >= 300) return chalk.cyan;
  if (status >= 200) return chalk.green;
  return chalk.white;
};

// ─── Formatters ───────────────────────────────────────────────────────────────

const logsDir = path.resolve(process.cwd(), 'logs');

const timestampFmt = winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' });

/** Console format: human-readable, colored */
const consoleFormat = winston.format.printf((info) => {
  const level = info.level as LogLevel;
  const colorLevel = (LEVEL_COLORS[level] ?? chalk.white)(level.toUpperCase().padEnd(5));
  const ts = chalk.dim(String(info.timestamp ?? ''));
  const component = info.component
    ? chalk.bold.blueBright(`[${String(info.component)}]`)
    : '';
  const msg = String(info.message);

  // Special coloring for HTTP access lines (from Morgan)
  if (level === 'http' && info.component === LOG_COMPONENTS.REQUEST) {
    const parts = msg.split(' ');
    const method = parts[0] ?? '';
    const url = parts[1] ?? '';
    const status = parseInt(parts[2] ?? '0', 10);
    const rest = parts.slice(3).join(' ');

    const colorMethod = (METHOD_COLORS[method] ?? chalk.white)(method);
    const colorStatus = STATUS_COLOR(status)(String(status));
    return `${ts} ${colorLevel} ${component} ${colorMethod} ${url} ${colorStatus} ${chalk.dim(rest)}`;
  }

  return `${ts} ${colorLevel} ${component} ${msg}`;
});

/** File format: structured JSON */
const fileFormat = winston.format.combine(
  timestampFmt,
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// ─── Transports ───────────────────────────────────────────────────────────────

const combinedTransport = new DailyRotateFile({
  dirname: logsDir,
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '20m',
  zippedArchive: true,
  level: 'debug',
  format: fileFormat,
});

const errorTransport = new DailyRotateFile({
  dirname: logsDir,
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  maxSize: '20m',
  zippedArchive: true,
  level: 'error',
  format: fileFormat,
});

const auditTransport = new DailyRotateFile({
  dirname: logsDir,
  filename: 'audit-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '90d',
  maxSize: '50m',
  zippedArchive: true,
  level: 'http',
  format: fileFormat,
});

const consoleTransport = new winston.transports.Console({
  level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    timestampFmt,
    winston.format.errors({ stack: true }),
    consoleFormat,
  ),
});

// ─── Root logger ──────────────────────────────────────────────────────────────

export const logger = winston.createLogger({
  levels: LOG_LEVELS,
  level: 'debug',
  transports: [consoleTransport, combinedTransport, errorTransport],
});

// ─── Audit logger (separate — only writes to audit file) ─────────────────────

export const auditLogger = winston.createLogger({
  levels: LOG_LEVELS,
  level: 'http',
  transports: [auditTransport],
  silent: false,
});

// ─── Component child loggers ─────────────────────────────────────────────────

function createComponentLogger(component: LogComponent): winston.Logger {
  return logger.child({ component, level: COMPONENT_LEVELS[component] });
}

export const serverLogger = createComponentLogger(LOG_COMPONENTS.SERVER);
export const dbLogger = createComponentLogger(LOG_COMPONENTS.DATABASE);
export const authLogger = createComponentLogger(LOG_COMPONENTS.AUTH);
export const usersLogger = createComponentLogger(LOG_COMPONENTS.USERS);
export const problemsLogger = createComponentLogger(LOG_COMPONENTS.PROBLEMS);
export const contestsLogger = createComponentLogger(LOG_COMPONENTS.CONTESTS);
export const submissionsLogger = createComponentLogger(LOG_COMPONENTS.SUBMISSIONS);
export const leaderboardLogger = createComponentLogger(LOG_COMPONENTS.LEADERBOARD);
export const adminLogger = createComponentLogger(LOG_COMPONENTS.ADMIN);
export const requestLogger = createComponentLogger(LOG_COMPONENTS.REQUEST);

// ─── Morgan stream ────────────────────────────────────────────────────────────

/** Pipe Morgan output into Winston http level */
export const morganStream = {
  write: (message: string): void => {
    requestLogger.http(message.trimEnd(), { component: LOG_COMPONENTS.REQUEST });
  },
};
