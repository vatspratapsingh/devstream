// backend/__tests__/notes.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /api/notes', () => {
  it('should respond with 200 and return an array', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});