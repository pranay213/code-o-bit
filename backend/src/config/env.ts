import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  SERVER_URL: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.string().default('12'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  FINGERPRINT_SECRET: z.string().default('code-o-bit-fingerprint-key'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('debug'),
  OLLAMA_API_KEY: z.string().optional(),
  OLLAMA_CRON_SECRET: z.string().default('my-secure-cron-secret'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Cannot use winston here — logger depends on env. Write directly.
  process.stderr.write(
    `[FATAL] Invalid environment variables:\n${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}\n`,
  );
  process.exit(1);
}

export const env = {
  port: parseInt(parsed.data.PORT, 10),
  serverUrl: parsed.data.SERVER_URL || `http://localhost:${parsed.data.PORT}`,
  nodeEnv: parsed.data.NODE_ENV,
  mongodbUri: parsed.data.MONGODB_URI,
  jwt: {
    accessSecret: parsed.data.JWT_ACCESS_SECRET,
    refreshSecret: parsed.data.JWT_REFRESH_SECRET,
    accessExpiresIn: parsed.data.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
  },
  bcryptSaltRounds: parseInt(parsed.data.BCRYPT_SALT_ROUNDS, 10),
  corsOrigin: parsed.data.CORS_ORIGIN,
  fingerprintSecret: parsed.data.FINGERPRINT_SECRET,
  logLevel: parsed.data.LOG_LEVEL,
  ollamaApiKey: parsed.data.OLLAMA_API_KEY,
  ollamaCronSecret: parsed.data.OLLAMA_CRON_SECRET,
} as const;
