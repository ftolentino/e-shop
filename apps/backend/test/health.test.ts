import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app';

describe('GET /api/health', () => {
  it('returns an ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', service: 'e-shop-backend' });
  });
});
