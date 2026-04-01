import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../models/fare.js', () => ({
  default: {
    findOne: jest.fn()
  }
}));

jest.unstable_mockModule('../utils/pathFinder.js', () => ({
  findShortestPath: jest.fn()
}));

const { default: Fare } = await import('../models/fare.js');
const { findShortestPath } = await import('../utils/pathFinder.js');
const app = (await import('../app.js')).default;

describe('Search API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return route', async () => {

    Fare.findOne.mockResolvedValue({
      p: 10, q: 20, r: 30, s: 40, t: 50
    });

    findShortestPath.mockResolvedValue({
      stops: 5,
      path: ['A', 'B'],
      interchangesRequired: 1,
      linesUsed: ['Blue'],
      routeDetails: []
    });

    const res = await request(app)
      .get('/search/search?source=A&destination=B');

    expect(res.statusCode).toBe(200);
  });

});