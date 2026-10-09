import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../app.js';
import * as authService from '../services/authService.js';

// Mock the auth service to bypass DB
jest.mock('../services/authService.js');

describe('Auth API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      authService.registerUser.mockResolvedValue({
        user: { id: '123', name: 'Test User', email: 'test@test.com' },
        token: 'mock_token',
      });

      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mock_token');
    });

    it('should return 400 for invalid data (Zod Validation)', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'T', // Too short
        email: 'invalid-email', // Invalid email
        password: '123', // Too short
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Name must be at least 2 characters');
      expect(res.body.message).toContain('Invalid email address');
    });
  });
});
