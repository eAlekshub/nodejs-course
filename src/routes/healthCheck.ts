import express from 'express';
import { healthCheck } from '../controllers/healthChecks.controllers';

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

router.get('/', healthCheck);

export default router;
