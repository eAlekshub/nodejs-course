import { app, server } from '../src/main';
import supertest from 'supertest';

const request = supertest(app);
const PORT = 3004;

describe('404 Route', () => {
  beforeAll((done) => {
    server.close();
    server.listen(PORT, () => {
      console.log(`Test server is listening on port ${PORT}`);
      done();
    });
  });

  it('should return a 404 error for an unknown route', async () => {
    const response = await request.get('/nonExistentRoute');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not found' });
  });
});
