import { Request, Response } from 'express';
import { genreValidation, movieValidation } from '../../src/middlewares/validator';

const res: Response = {} as Response;
const next: jest.Mock = jest.fn();

describe('genreValidation', () => {
  it('should pass validation with a valid genre name', () => {
    const req: Request = {
      body: {
        name: 'Comedy',
      },
    } as Request;

    genreValidation(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return a 400 error for an empty genre name', () => {
    const req: Request = {
      body: {
        name: '',
      },
    } as Request;

    genreValidation(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Name field is required',
        code: 400,
      }),
    );
  });
});

describe('movieValidation', () => {
  it('should pass validation with valid movie data', () => {
    const req: Request = {
      body: {
        title: 'New Movie',
        description: 'New Movie Description',
        releaseDate: '2023-01-01',
        genre: ['Comedy', 'Fantasy'],
      },
    } as Request;
    movieValidation(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return a 400 error for missing required fields', () => {
    const req: Request = {
      body: {
        description: 'New Movie Description',
        releaseDate: '2023-01-01',
        genre: ['Comedy', 'Fantasy'],
      },
    } as Request;
    movieValidation(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Title field is required',
        code: 400,
      }),
    );
  });

  it('should return a 400 error for an invalid release date', () => {
    const req: Request = {
      body: {
        title: 'New Movie',
        description: 'New Movie Description',
        releaseDate: 'invalid-date',
        genre: ['Comedy', 'Fantasy'],
      },
    } as Request;

    movieValidation(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 422,
        message: 'Invalid release date',
      }),
    );
  });

  it('should return a 400 error for an empty genre array', () => {
    const req: Request = {
      body: {
        title: 'New Movie',
        description: 'New Movie Description',
        releaseDate: '2023-01-01',
        genre: [],
      },
    } as Request;

    movieValidation(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'Genre field is required and should be an array',
      }),
    );
  });
});
