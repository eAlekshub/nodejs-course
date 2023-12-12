import supertest from 'supertest';
import { genreModel } from '../../src/models/genres';
import { app, server } from '../../src/main';
import { Genre } from '../../src/interfaces';
import { apiErrors } from '../../src/constants';

const request = supertest(app);
const PORT = 3002;
const genre: Genre = { id: 'genreId', name: 'Deleted Genre' } as Genre;

describe('Genres route', () => {
  beforeAll((done) => {
    server.close();
    server.listen(PORT, () => {
      console.log(`Test server is listening on port ${PORT}`);
      done();
    });
  });

  describe('GET /genres', () => {
    it('should return a list of genres', async () => {
      const fakeGenres: Genre[] = [{ name: 'Action' }, { name: 'Drama' }];
      genreModel.find = jest.fn().mockResolvedValue(fakeGenres);
      const response = await request.get('/genres');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeGenres);
    });
    it('should return a 500 error', async () => {
      genreModel.find = jest.fn().mockRejectedValue(new Error(apiErrors.SERVER_ERROR));
      const response = await request.get('/genres');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: apiErrors.SERVER_ERROR });
    });
  });

  describe('POST /genres', () => {
    it('should create a new genre with valid name', async () => {
      const validGenreData: Genre = { name: 'Comedy' };
      const response = await request.post('/genres').send(validGenreData);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(validGenreData);
    });
    it('should handle invalid name and return a 400 error', async () => {
      const invalidGenreData: Genre = { name: '' };
      const response = await request.post('/genres').send(invalidGenreData);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: apiErrors.REQUIRED_NANE });
    });
    it('should handle database error and return a 500 error', async () => {
      genreModel.prototype.save = jest.fn().mockRejectedValue(new Error(apiErrors.SERVER_ERROR));
      const response = await request.post('/genres').send(genre);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: apiErrors.SERVER_ERROR });
    });
  });

  describe('PUT /genres/:id', () => {
    it('should update a genre with valid name', async () => {
      genreModel.findOneAndUpdate = jest.fn().mockResolvedValue(genre);
      const response = await request.put('/genres/genreId').send(genre);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(genre);
    });
    it('should return a 400 error for invalid name', async () => {
      const invalidGenreData: Genre = { id: 'genreId', name: '' } as Genre;
      const response = await request.put('/genres/genreId').send(invalidGenreData);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: apiErrors.REQUIRED_NANE });
    });
    it('should return a 404 error for a non-existent genre', async () => {
      genreModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);
      const response = await request.put('/genres/nonExistentId').send(genre);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: apiErrors.NOT_FOUND });
    });

    it('should handle a server error and return a 500 error', async () => {
      genreModel.findOneAndUpdate = jest.fn().mockRejectedValue(new Error(apiErrors.SERVER_ERROR));
      const response = await request.put('/genres/genreId').send(genre);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: apiErrors.SERVER_ERROR });
    });
  });

  describe('DELETE /genres/:id', () => {
    it('should delete a genre by id', async () => {
      genreModel.findByIdAndRemove = jest.fn().mockResolvedValue(genre);
      const response = await request.delete('/genres/genreId').send(genre);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Genre deleted successfully' });
    });

    it('should return a 404 error for a non-existent genre', async () => {
      genreModel.findByIdAndRemove = jest.fn().mockResolvedValue(null);
      const response = await request.delete('/genres/nonExistentId').send(genre);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: apiErrors.NOT_FOUND });
    });

    it('should handle a server error and return a 500 error', async () => {
      genreModel.findByIdAndRemove = jest.fn().mockRejectedValue(new Error(apiErrors.SERVER_ERROR));
      const response = await request.delete('/genres/genreId').send(genre);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: apiErrors.SERVER_ERROR });
    });
  });
});
