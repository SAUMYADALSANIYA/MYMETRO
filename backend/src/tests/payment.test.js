import { jest } from '@jest/globals';
import request from 'supertest';

// 🔥 MOCK EVERYTHING THAT TOUCHES DB / EXTERNAL

jest.unstable_mockModule('qrcode', () => ({
  default: {
    toDataURL: jest.fn().mockResolvedValue('fakeQR')
  }
}));

jest.unstable_mockModule('crypto', () => ({
  default: {
    randomUUID: () => 'fake-uuid'
  }
}));

jest.unstable_mockModule('../models/payment.js', () => ({
  default: { create: jest.fn() }
}));

jest.unstable_mockModule('../models/ticket.js', () => ({
  default: { create: jest.fn() }
}));

jest.unstable_mockModule('../models/fare.js', () => ({
  default: { findOne: jest.fn() }
}));

// 🔥 THIS WAS MISSING (IMPORTANT FIX)
jest.unstable_mockModule('../models/route.js', () => ({
  default: {
    findOne: jest.fn().mockResolvedValue({ _id: 'route123' }),
    find: jest.fn()
  }
}));

jest.unstable_mockModule('../utils/pathFinder.js', () => ({
  findShortestPath: jest.fn()
}));

// IMPORT AFTER MOCKS
const { default: Payment } = await import('../models/payment.js');
const { default: Ticket } = await import('../models/ticket.js');
const { default: Fare } = await import('../models/fare.js');
const { findShortestPath } = await import('../utils/pathFinder.js');

const app = (await import('../app.js')).default;

describe('Payment API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process payment', async () => {

    findShortestPath.mockResolvedValue({ stops: 4 });

    Fare.findOne.mockResolvedValue({
      p: 10, q: 20, r: 30, s: 40, t: 50
    });

    Payment.create.mockResolvedValue({ status: "SUCCESS" });
    Ticket.create.mockResolvedValue({ _id: '123' });

    const res = await request(app)
      .post('/payment/pay')
      .send({
        routeId: 'invalid-id', // force Route.findOne to run
        routeName: 'Blue',
        source: 'A',
        destination: 'B',
        cardNumber: '1234567812345678',
        cardHolder: 'Test',
        cvv: '123'
      });

    expect(res.statusCode).toBe(200);

  });

});