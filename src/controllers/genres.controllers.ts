import { NextFunction, Request, Response } from 'express';
import { genreModel } from '../models/genres';
import { Genre } from '../interfaces';
import { apiErrors } from '../constants';
import { HttpError } from '../errors/httpError';

export const getAllGenres = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const genres: Genre[] = await genreModel.find({}, { _id: 0, __v: 0 });
    res.json(genres);
  } catch (error) {
    next(error);
  }
};

export const createGenre = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.body;
    const genre = new genreModel({ name });
    const savedGenre: Genre | null = await genre.save();
    const cleanedResponse: Genre = {
      name: savedGenre.name,
    };
    res.status(201).json(cleanedResponse);
  } catch (error) {
    next(error);
  }
};

export const updateGenre = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.body;
    const updatedGenre: Genre | null = await genreModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name } },
      { new: true, fields: { _id: 0, __v: 0 } },
    );

    if (updatedGenre) {
      res.json(updatedGenre);
    } else {
      next(new HttpError(apiErrors.NOT_FOUND, 404));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteGenre = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedGenre: Genre | null = await genreModel.findByIdAndRemove(req.params.id);

    if (deletedGenre) {
      res.status(200).json({ message: 'Genre deleted successfully' });
    } else {
      next(new HttpError(apiErrors.NOT_FOUND, 404));
    }
  } catch (error) {
    next(error);
  }
};
