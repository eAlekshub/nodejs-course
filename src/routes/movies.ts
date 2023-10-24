import express, { NextFunction, Request, Response } from 'express';
import { movieModel } from '../models/movies';
import { Movie } from '../interfaces';
import { HttpError } from '../errors/httpError';
import { apiErrors } from '../constants';

const router: express.Router = express.Router();

/**
 * @openapi
 *    tags:
 *    name: Movies
 *    description: API functions for managing movies
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             example:
 *               - title: Movie 1
 *                 description: Description 1
 *                 releaseDate: 2022-01-01
 *                 genre: Action
 *               - title: Movie 2
 *                 description: Description 2
 *                 releaseDate: 2022-02-01
 *                 genre: Drama
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const movies: Movie[] = await movieModel.find({}, { _id: 0, __v: 0, updatedAt: 0 });
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /movies:
 *   post:
 *     summary: Add a new movie
 *     tags:
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: New Movie
 *             description: New Movie Description
 *             releaseDate: 2023-01-01
 *             genre: Comedy
 *     responses:
 *       201:
 *         description: Movie added successfully
 *         content:
 *           application/json:
 *             example:
 *               title: New Movie
 *               description: New Movie Description
 *               releaseDate: 2023-01-01
 *               genre: Comedy
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All fields are required
 *       422:
 *         description: Unprocessable Entity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid date format
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, releaseDate, genre } = req.body;
    if (!title || !description || !releaseDate || !genre) {
      next(new HttpError(apiErrors.REQUIRED_FIELDS, 400));
    }
    const validReleaseDate = new Date(releaseDate);
    if (isNaN(validReleaseDate.getTime())) {
      next(new HttpError(apiErrors.INVALID_DATE, 422));
    }
    const movie = new movieModel({ title, description, releaseDate, genre });
    const savedMovie: Movie | null = await movie.save();
    const cleanedResponse: Movie = {
      title: savedMovie.title,
      description: savedMovie.description,
      releaseDate: savedMovie.releaseDate,
      genre: savedMovie.genre,
    };

    res.status(201).json(cleanedResponse);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /movies/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: Updated Movie
 *             description: Updated Movie Description
 *             releaseDate: 2023-02-01
 *             genre: Action
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             example:
 *               title: Updated Movie
 *               description: Updated Movie Description
 *               releaseDate: 2023-02-01
 *               genre: Action
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All fields are required
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not found
 *       422:
 *         description: Unprocessable Entity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid date format
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, releaseDate, genre } = req.body;
    if (!title || !description || !releaseDate || !genre) {
      next(new HttpError(apiErrors.REQUIRED_FIELDS, 400));
    }

    const validReleaseDate = new Date(releaseDate);
    if (isNaN(validReleaseDate.getTime())) {
      next(new HttpError(apiErrors.INVALID_DATE, 422));
    }
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
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to be deleted.
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: Movie deleted successfully
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedMovie: Movie | null = await movieModel.findByIdAndRemove(req.params.id);
    if (deletedMovie) {
      res.status(200).json({ message: 'Movie deleted successfully' });
    } else {
      next(new HttpError(apiErrors.NOT_FOUND, 404));
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /movies/genre/{genreName}:
 *   get:
 *     summary: Get movies by genre
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: genreName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the genre to search for movies.
 *     responses:
 *       200:
 *         description: List of movies with the specified genre
 *         content:
 *           application/json:
 *             example:
 *               - title: Movie 1
 *                 description: Description 1
 *                 releaseDate: 2022-01-01
 *                 genre: Action
 *               - title: Movie 2
 *                 description: Description 2
 *                 releaseDate: 2022-02-01
 *                 genre: Action
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get('/genre/:genreName', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const genreName = req.params.genreName;
    const movies: Movie[] = await movieModel.find({ genre: genreName });
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

export default router;
