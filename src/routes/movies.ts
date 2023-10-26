import express from 'express';
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieByGenre,
  updateMovie,
} from '../controllers/movies.controllers';
import { movieValidation } from '../middlewares/validator';
import { asyncWrapper } from '../asyncWrapper';

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
 *                 genre:
 *                   - Action
 *                   - Comedy
 *               - title: Movie 2
 *                 description: Description 2
 *                 releaseDate: 2022-02-01
 *                 genre:
 *                   - Drama
 *                   - Comedy
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

router.get('/', asyncWrapper(getAllMovies));

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
 *             genre:
 *               - Comedy
 *               - Fantasy
 *     responses:
 *       201:
 *         description: Movie added successfully
 *         content:
 *           application/json:
 *             example:
 *               title: New Movie
 *               description: New Movie Description
 *               releaseDate: 2023-01-01
 *               genre:
 *                 - Comedy
 *                 - Fantasy
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Title field is required
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

router.post('/', movieValidation, asyncWrapper(createMovie));

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
 *             genre:
 *               - Action
 *               - Fantasy
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             example:
 *               title: Updated Movie
 *               description: Updated Movie Description
 *               releaseDate: 2023-02-01
 *             genre:
 *               - Action
 *               - Fantasy
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Title field is required
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

router.put('/:id', movieValidation, asyncWrapper(updateMovie));

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

router.delete('/:id', asyncWrapper(deleteMovie));

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

router.get('/genre/:genreName', asyncWrapper(getMovieByGenre));

export default router;
