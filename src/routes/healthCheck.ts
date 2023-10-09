import express, { Request, Response } from 'express';

const router: express.Router = express.Router();

/**
 * @openapi
 * tags:
 *    name: API functions
 * /health-check:
 *   get:
 *     summary: Checking the server's health
 *     tags: [API functions]
 *     responses:
 *       200:
 *         description: Returns a JSON response indicating that the server is running.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Server is up and running!"
 */

router.get('/', (req: Request, res: Response): void => {
  const response: { status: string } = { status: 'Server is up and running' };
  res.status(200).json(response);
});

export default router;
