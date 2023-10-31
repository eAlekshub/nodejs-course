import supertest from 'supertest';
import healthCheck from '../../src/routes/healthCheck';
import express from 'express';
import http from 'http';

const app = express();
const request = supertest(app);
const PORT = 3001;
app.use('/health-check', healthCheck);

describe('healthCheck Route', () => {
  let server: http.Server;

  beforeAll((done) => {
    server = app.listen(PORT, () => {
      console.log(`Test server is listening on port ${PORT}`);
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      console.log('Test server closed');
      done();
    });
  });

  it('should return a health check response', async () => {
    const response = await request.get('/health-check');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'Server is up and running' });
  });
});
