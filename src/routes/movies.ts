import express, { Request, Response } from 'express';
import { movieModel } from '../models/movies';
import { Movie } from '../interfaces';

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
 *       404:
 *         description: Movies not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Movies not found
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

router.get('/', (req: Request, res: Response): void => {
  movieModel
    .find()
    .then((movies: Movie[]): void => {
      if (movies.length > 0) {
        res.json(movies);
      } else {
        res.status(404).json({ error: 'Movies not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
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

router.post('/', (req: Request, res: Response): Response | undefined => {
  const { title, description, releaseDate, genre } = req.body;
  if (!title || !description || !releaseDate || !genre) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const movie = new movieModel({ title, description, releaseDate, genre });
  movie
    .save()
    .then((movie: Movie | null): void => {
      res.status(201).json(movie);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
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
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Movie not found
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

router.put('/:id', (req: Request, res: Response): Response | undefined => {
  const { title, description, releaseDate, genre } = req.body;
  if (!title || !description || !releaseDate || !genre) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const updatedMovie = {
    title,
    description,
    releaseDate,
    genre,
  };
  movieModel
    .findOneAndUpdate({ _id: req.params.id }, { $set: updatedMovie })
    .then((updatedMovie: Movie | null): void => {
      if (updatedMovie) {
        res.json(updatedMovie);
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
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
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Movie not found
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

router.delete('/:id', (req: Request, res: Response): void => {
  movieModel
    .findByIdAndRemove(req.params.id)
    .then((deletedMovie: Movie | null): void => {
      if (deletedMovie) {
        res.status(200).json({ message: 'Movie deleted successfully' });
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
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
 *         description: Movies not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Movies not found
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

router.get('/genre/:genreName', (req: Request, res: Response): void => {
  const genreName = req.params.genreName;
  movieModel
    .find({ genre: genreName })
    .then((movies: Movie[]): void => {
      if (movies.length > 0) {
        res.json(movies);
      } else {
        res.status(404).json({ error: 'Movies not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

export default router;
