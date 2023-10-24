import express, { NextFunction, Request, Response } from 'express';
import { genreModel } from '../models/genres';
import { Genre } from '../interfaces';
import { HttpError } from '../errors/httpError';
import { apiErrors } from '../constants';

const router: express.Router = express.Router();

/**
 * @openapi
 *    tags:
 *    name: Genres
 *    description: API functions for managing genres
 * /genres:
 *   get:
 *     summary: Get all genres
 *     tags:
 *       - Genres
 *     responses:
 *       200:
 *         description: List of genres
 *         content:
 *           application/json:
 *             example:
 *               - name: Action
 *               - name: Drama
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
    const genres: Genre[] = await genreModel.find({}, { _id: 0, __v: 0 });
    res.json(genres);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /genres:
 *   post:
 *     summary: Add a new genre
 *     tags:
 *       - Genres
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Comedy
 *     responses:
 *       201:
 *         description: Genre added successfully
 *         content:
 *           application/json:
 *             example:
 *               name: Comedy
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Name field is required
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
    const { name } = req.body;
    if (!name) {
      next(new HttpError(apiErrors.REQUIRED_NANE, 400));
    }
    const genre = new genreModel({ name });
    const savedGenre: Genre | null = await genre.save();
    const cleanedResponse: Genre = {
      name: savedGenre.name,
    };
    res.status(201).json(cleanedResponse);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /genres/{id}:
 *   put:
 *     summary: Update a genre by ID
 *     tags:
 *       - Genres
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the genre to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Updated Genre
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *         content:
 *           application/json:
 *             example:
 *               name: Updated Genre
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Name field is required
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

router.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      next(new HttpError(apiErrors.REQUIRED_NANE, 400));
    }
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
});

/**
 * @openapi
 * /genres/{id}:
 *   delete:
 *     summary: Delete a genre by ID
 *     tags:
 *       - Genres
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the genre to be deleted.
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: Genre deleted successfully
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
    const deletedGenre: Genre | null = await genreModel.findByIdAndRemove(req.params.id);

    if (deletedGenre) {
      res.status(200).json({ message: 'Genre deleted successfully' });
    } else {
      next(new HttpError(apiErrors.NOT_FOUND, 404));
    }
  } catch (error) {
    next(error);
  }
});

export default router;
