import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { env } from '@/config/env';
import { swaggerSpec } from '@/config/swagger';
import { morganStream } from '@/config/logger';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { requestContextMiddleware } from '@/middlewares/request-context.middleware';
import { auditMiddleware } from '@/middlewares/audit.middleware';
import { sendSuccess } from '@/utils/api-response';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';

import authRoutes from '@/modules/auth/auth.routes';
import userRoutes from '@/modules/users/user.routes';
import problemRoutes from '@/modules/problems/problem.routes';
import contestRoutes from '@/modules/contests/contest.routes';
import submissionRoutes from '@/modules/submissions/submission.routes';
import leaderboardRoutes from '@/modules/leaderboard/leaderboard.routes';
import adminRoutes from '@/modules/admin/admin.routes';

// Load Express type augmentations
import '@/types/common';

const app = express();

// Trust proxy (required for resolving real IP behind load balancers or proxies)
app.set('trust proxy', true);

// Request context and audit logging (must be the first middleware)
app.use(requestContextMiddleware);
app.use(auditMiddleware);

// Security headers and CORS configuration
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
    exposedHeaders: ['X-Request-ID'],
  }),
);

// HTTP access logging (routes Morgan output to Winston)
if (env.nodeEnv !== 'test') {
  app.use(
    morgan(
      ':method :url :status :res[content-length]B :response-time ms — :remote-addr',
      { stream: morganStream },
    ),
  );
}

// Request payload parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Documentation (Swagger UI)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  sendSuccess(
    res,
    {
      status: 'ok',
      environment: env.nodeEnv,
      requestId: req.context?.requestId,
    },
    SUCCESS_MESSAGES.SERVICE_HEALTHY,
  );
});

// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// 404 Not Found handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
    errors: [],
    statusCode: 404,
  });
});

// Global error handler (must be the last middleware)
app.use(errorMiddleware);

export default app;
