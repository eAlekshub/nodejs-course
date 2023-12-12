import supertest from 'supertest';
import { app, server } from '../../src/main';
import { movieModel } from '../../src/models/movies';
import { Movie } from '../../src/interfaces';
import { apiErrors } from '../../src/constants';

const request = supertest(app);
const PORT = 3003;

const movie: Movie = {
  id: 'movieId',
  title: 'Movie',
  description: 'Movie description',
  releaseDate: new Date('2021-05-08'),
  genre: ['Action', 'Fantasy'],
} as Movie;

describe('Movies route', () => {
  beforeAll((done) => {
    server.close();
    server.listen(PORT, () => {
      console.log(`Test server is listening on port ${PORT}`);
      done();
    });
  });

  describe('GET /movies', () => {
    it('should return a list of movies', async () => {
      const fakeMovies: Movie[] = [
        {
          title: 'Movie_1',
          description: 'Movie_1 description',
        },
        {
          title: 'Movie_2',
          description: 'Movie_2 description',
        },
      ] as Movie[];
      movieModel.find = jest.fn().mockResolvedValue(fakeMovies);
      const response = await request.get('/movies');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeMovies);
    });

    it('should return a 500 error', async () => {
      movieModel.find = jest.fn().mockRejectedValue(new Error(apiErrors.SERVER_ERROR));
      const response = await request.get('/movies');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: apiErrors.SERVER_ERROR });
    });
  });

  describe('POST /movies', () => {
    it('should create a new movie with valid fields', async () => {
      const validMovieData: Movie = {
        title: 'New movie',
        description: 'New movie description',
        releaseDate: new Date('2021-05-08'),
        genre: ['Action', 'Fantasy'],
      };
      const expectedMovieData = { ...validMovieData, releaseDate: validMovieData.releaseDate.toISOString() };
      const response = await request.post('/movies').send(expectedMovieData);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expectedMovieData);
    });

    it('should handle invalid fields and return a 400 error', async () => {
      const invalidMovieData: Movie = {
        title: '',
        description: 'New movie description',
        releaseDate: new Date('2021-05-08'),
        genre: ['Action', 'Fantasy'],
      };
      const response = await request.post('/movies').send(invalidMovieData);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: apiErrors.REQUIRED_TITLE });
    });

    it('should return a 422 error for invalid date format', async () => {
      const invalidMovieData: Movie = {
        title: 'New Movie',
        description: 'New Movie Description',
        releaseDate: new Date('2023-01-xx'),
        genre: ['Comedy', 'Fantasy'],
      };
      const expectedMovieData = { ...invalidMovieData, releaseDate: invalidMovieData.releaseDate.toDateString() };
      const response = await request.post('/movies').send(expectedMovieData);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({ error: apiErrors.INVALID_DATE });
    });

    it('should handle database error and return a 500 error', async () => {
      const expectedMovieData = { ...movie, releaseDate: movie.releaseDate.toISOString() };
      movieModel.prototype.save = jest.fn().mockRejectedValue(new Error(apiErrors.SERVER_ERROR));
      const response = await request.post('/movies').send(expectedMovieData);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: apiErrors.SERVER_ERROR });
    });
  });

  describe('PUT /movies/:id', () => {
    it('should update a movie with valid fields', async () => {
      const expectedMovieData = { ...movie, releaseDate: movie.releaseDate.toISOString() };
      movieModel.findOneAndUpdate = jest.fn().mockResolvedValue(movie);
      const response = await request.put('/movies/movieId').send(movie);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedMovieData);
    });
    it('should return a 400 error for invalid fields', async () => {
      const invalidMovieData: Movie = {
        id: 'movieId',
        title: '',
        description: 'New Movie Description',
        releaseDate: new Date('2023-01-01'),
        genre: ['Comedy', 'Fantasy'],
      } as Movie;
      const response = await request.put('/movies/movieId').send(invalidMovieData);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: apiErrors.REQUIRED_TITLE });
    });

    it('should return a 404 error for a non-existent movie', async () => {
      movieModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);
      const response = await request.put('/movies/genreId').send(movie);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: apiErrors.NOT_FOUND });
    });

    it('should handle a server error and return a 500 error', async () => {
      movieModel.findOneAndUpdate = jest.fn().mockRejectedValue(new Error(apiErrors.SERVER_ERROR));
      const response = await request.put('/movies/genreId').send(movie);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: apiErrors.SERVER_ERROR });
    });
  });

  describe('DELETE /movies/:id', () => {
    it('should delete a movie by id', async () => {
      movieModel.findByIdAndRemove = jest.fn().mockResolvedValue(movie);
      const response = await request.delete('/movies/genreId').send(movie);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Movie deleted successfully' });
    });

    it('should return a 404 error for a non-existent movie', async () => {
      movieModel.findByIdAndRemove = jest.fn().mockResolvedValue(null);
      const response = await request.delete('/movies/movieId').send(movie);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: apiErrors.NOT_FOUND });
    });

    it('should handle a server error and return a 500 error', async () => {
      movieModel.findByIdAndRemove = jest.fn().mockRejectedValue(new Error(apiErrors.SERVER_ERROR));
      const response = await request.delete('/movies/movieId').send(movie);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: apiErrors.SERVER_ERROR });
    });
  });

  describe('GET /movies/genre/:genreName', () => {
    it('should return a list of movies for a valid genre', async () => {
      const genreName: string = 'Action';
      const fakeMovies: Movie[] = [
        {
          title: 'Movie 1',
          genre: ['Action'],
        },
        {
          title: 'Movie 2',
          genre: ['Action'],
        },
      ] as Movie[];

      movieModel.find = jest.fn().mockResolvedValue(fakeMovies);
      const response = await request.get(`/movies/genre/${genreName}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(fakeMovies);
    });

    it('should return an empty list for a non-existent genre', async () => {
      const genreName: string = 'Comedy';
      movieModel.find = jest.fn().mockResolvedValue([]);
      const response = await request.get(`/movies/genre/${genreName}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([]);
    });

    it('should handle internal server error and return a 500 error', async () => {
      const genreName: string = 'Comedy';
      movieModel.find = jest.fn().mockRejectedValue(new Error(apiErrors.SERVER_ERROR));
      const response = await request.get(`/movies/genre/${genreName}`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: apiErrors.SERVER_ERROR });
    });
  });
});
