import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../models/ticket.js', () => ({
  default: {
    find: jest.fn()
  }
}));

const { default: Ticket } = await import('../models/ticket.js');
const app = (await import('../app.js')).default;

describe('Customer API', () => {

  it('should fetch journeys', async () => {

    Ticket.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { source: 'A', destination: 'B' }
      ])
    });

    const res = await request(app)
      .get('/customer/my-journeys');

    expect(res.statusCode).toBe(200);
  });

});