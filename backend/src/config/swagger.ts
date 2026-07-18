import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '@/config/env';
import { APP_INFO } from '@/constants/app-info';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: APP_INFO.NAME,
      version: APP_INFO.VERSION,
      description: APP_INFO.DESCRIPTION,
      contact: {
        name: APP_INFO.CONTACT_NAME,
      },
    },
    servers: [
      {
        url: `${env.serverUrl}/api`,
        description: APP_INFO.SERVER_DESCRIPTION_DEV,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object', nullable: true },
            meta: { type: 'object', nullable: true },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
            statusCode: { type: 'integer' },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
