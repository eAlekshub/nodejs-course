import express, { Request, Response } from 'express';
import { genreModel } from '../models/genres';
import { Genre } from '../interfaces';

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
 *       404:
 *         description: Genres not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Genres not found
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
  genreModel
    .find()
    .then((genres: Genre[]): void => {
      if (genres.length > 0) {
        res.json(genres);
      } else {
        res.status(404).json({ error: 'Genres not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
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

router.post('/', (req: Request, res: Response): Response | undefined => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name field is required' });
  }
  const genre = new genreModel({ name });
  genre
    .save()
    .then((genre: Genre | null): void => {
      res.status(201).json(genre);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
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
 *         description: Genre not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Genre not found
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
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name field is required' });
  }

  const updatedGenre = {
    name,
  };
  genreModel
    .findOneAndUpdate({ _id: req.params.id }, { $set: updatedGenre })
    .then((updatedGenre: Genre | null): void => {
      if (updatedGenre) {
        res.json(updatedGenre);
      } else {
        res.status(404).json({ error: 'Genre not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
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
 *         description: Genre not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Genre not found
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
  genreModel
    .findByIdAndRemove(req.params.id)
    .then((deletedGenre: Genre | null): void => {
      if (deletedGenre) {
        res.status(200).json({ message: 'Genre deleted successfully' });
      } else {
        res.status(404).json({ error: 'Genre not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

export default router;
