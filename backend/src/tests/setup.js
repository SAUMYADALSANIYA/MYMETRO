import { jest } from '@jest/globals';

// Mock auth middleware
jest.unstable_mockModule('../middleware/authMiddleware.js', () => ({
  default: (req, res, next) => {
    req.user = { id: 'testUserId', role: 'Customer' };
    next();
  }
}));