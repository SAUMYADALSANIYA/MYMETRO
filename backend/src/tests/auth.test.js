import { jest } from '@jest/globals';
import request from 'supertest';

// mock User model
jest.unstable_mockModule('../models/user.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

const { default: User } = await import('../models/user.js');
const app = (await import('../app.js')).default;

describe('Auth API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register user', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: '123',
      email: 'test@test.com',
      role: 'Customer'
    });

    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@test.com',
        password: '12345678'
      });

    expect(res.statusCode).toBe(201);
  });

});