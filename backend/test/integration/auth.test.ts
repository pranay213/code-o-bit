import request from 'supertest';
import app from '@/app';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';
import { ERROR_MESSAGES } from '@/constants/error-messages';

describe('Auth API', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app).post('/api/auth/register').send(testUser);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(SUCCESS_MESSAGES.REGISTERED);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.username).toBe(testUser.username);
      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    it('should fail if email is already taken', async () => {
      // First registration happened in previous test, DB is not cleared within describe block unless afterEach is setup correctly. 
      // Actually, test/setup.ts clears DB in afterEach, so we must register again first.
      await request(app).post('/api/auth/register').send(testUser);

      const response = await request(app).post('/api/auth/register').send({
        ...testUser,
        username: 'anotherusername', // Ensure only email is duplicate
      });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app).post('/api/auth/register').send({
        ...testUser,
        email: 'not-an-email',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(SUCCESS_MESSAGES.LOGGED_IN);
      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword123!',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });
  });
});
