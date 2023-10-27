import { NextFunction, Request, Response } from 'express';
import { movieModel } from '../models/movies';
import { Movie } from '../interfaces';
import { apiErrors } from '../constants';
import { HttpError } from '../errors/httpError';

export const getAllMovies = async (req: Request, res: Response): Promise<void> => {
  const movies: Movie[] = await movieModel.find({}, { _id: 0, __v: 0, updatedAt: 0 });
  res.json(movies);
};

export const createMovie = async (req: Request, res: Response): Promise<void> => {
  const { title, description, releaseDate, genre } = req.body;
  const movie = new movieModel({ title, description, releaseDate, genre: [...genre] });
  const savedMovie: Movie | null = await movie.save();
  const cleanedResponse: Movie = {
    title: savedMovie.title,
    description: savedMovie.description,
    releaseDate: savedMovie.releaseDate,
    genre: savedMovie.genre,
  };
  res.status(201).json(cleanedResponse);
};

export const updateMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, description, releaseDate, genre } = req.body;
  const updatedMovie: Movie | null = await movieModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title,
        description,
        releaseDate,
        genre,
      },
    },
    { new: true, fields: { _id: 0, __v: 0 } },
  );

  if (updatedMovie) {
    res.json(updatedMovie);
  } else {
    next(new HttpError(apiErrors.NOT_FOUND, 404));
  }
};

export const deleteMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id: string = req.params.id;
  const deletedMovie: Movie | null = await movieModel.findByIdAndRemove(id);
  if (deletedMovie) {
    res.status(200).json({ message: 'Movie deleted successfully' });
  } else {
    next(new HttpError(apiErrors.NOT_FOUND, 404));
  }
};

export const getMovieByGenre = async (req: Request, res: Response): Promise<void> => {
  const genreName: string = req.params.genreName;
  const movies: Movie[] = await movieModel.find({ genre: { $in: [genreName] } }, { _id: 0, __v: 0, updatedAt: 0 });
  res.json(movies);
};
