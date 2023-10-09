import express, { Request, Response } from 'express';
import { apiErrors } from '../constants';

const router: express.Router = express.Router();

/**
 * @openapi
 * tags:
 *    name: API functions
 * /users/{id}:
 *   get:
 *     summary: Returns user by id
 *     tags: [API functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     name:
 *                       type: string
 *                       example: "User name"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.get('/:id', (req: Request, res: Response): void => {
  try {
    const userId: string = req.params.id;

    if (userId === 'error') {
      throw new Error('Something went wrong');
    }

    if (userId !== '1') {
      const errorResponse: { error: string } = { error: apiErrors.NOT_FOUND };
      res.status(404).json(errorResponse);
    } else {
      const user: { id: string; name: string } = { id: userId, name: 'User name' };
      res.status(200).json(user);
    }
  } catch (error) {
    const errorResponse: { error: string } = { error: apiErrors.SERVER_ERROR };
    res.status(500).json(errorResponse);
  }
});

export default router;
