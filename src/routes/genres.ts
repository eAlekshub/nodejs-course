import express from 'express';
import { deleteGenre, getAllGenres, createGenre, updateGenre } from '../controllers/genres.controllers';
import { genreValidation } from '../middlewares/validator';
import { asyncWrapper } from '../asyncWrapper';

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

router.get('/', asyncWrapper(getAllGenres));

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

router.post('/', genreValidation, asyncWrapper(createGenre));

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

router.put('/:id', genreValidation, asyncWrapper(updateGenre));

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

router.delete('/:id', asyncWrapper(deleteGenre));

export default router;
