import request from 'supertest';
import app from '@/app';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';

describe('Health Check API', () => {
  it('should return 200 OK and service healthy message', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(SUCCESS_MESSAGES.SERVICE_HEALTHY);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.environment).toBe('test');
  });

  it('should include X-Request-ID header in response', async () => {
    const response = await request(app).get('/api/health');
    expect(response.headers['x-request-id']).toBeDefined();
    expect(typeof response.headers['x-request-id']).toBe('string');
  });
});
