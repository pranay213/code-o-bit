import request from 'supertest';
import app from '@/app';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { UserModel } from '@/modules/users/user.model';
import { ROLES } from '@/constants/roles';

describe('Problems API', () => {
  let adminToken: string;
  let userToken: string;

  const testProblem = {
    title: 'Two Sum',
    slug: 'two-sum',
    description: 'Given an array of integers...',
    difficulty: 'easy',
    timeLimit: 1000,
    memoryLimit: 256,
    testCases: [{ input: '1 2', expectedOutput: '3', isPublic: true }],
    isPublished: true,
  };

  beforeEach(async () => {
    // Create an admin user and get token
    await request(app).post('/api/auth/register').send({
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'Password123!',
    });
    await UserModel.updateOne({ email: 'admin@example.com' }, { role: ROLES.ADMIN });

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'Password123!',
    });
    adminToken = adminLogin.body.data.tokens.accessToken;

    // Create a regular user and get token
    await request(app).post('/api/auth/register').send({
      username: 'regularuser',
      email: 'user@example.com',
      password: 'Password123!',
    });
    
    const userLogin = await request(app).post('/api/auth/login').send({
      email: 'user@example.com',
      password: 'Password123!',
    });
    if (!userLogin.body.data) console.log('userLogin failed:', userLogin.body);
    userToken = userLogin.body.data.tokens.accessToken;
  });

  describe('POST /api/problems', () => {
    it('should allow admin to create a problem', async () => {
      const response = await request(app)
        .post('/api/problems')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testProblem);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(SUCCESS_MESSAGES.PROBLEM_CREATED);
      expect(response.body.data.slug).toBe(testProblem.slug);
    });

    it('should reject non-admin from creating a problem', async () => {
      const response = await request(app)
        .post('/api/problems')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testProblem);
      
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(ERROR_MESSAGES.FORBIDDEN);
    });
  });

  describe('GET /api/problems', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/problems')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testProblem);
    });

    it('should return a list of problems', async () => {
      const response = await request(app).get('/api/problems');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(SUCCESS_MESSAGES.PROBLEMS_FETCHED);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].title).toBe(testProblem.title);
    });
  });
});
