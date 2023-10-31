import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swaggerOptions';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import { apiEndpoints, apiErrors } from './constants';

import healthCheckRoute from './routes/healthCheck';
import moviesRouter from './routes/movies';
import genresRouter from './routes/genres';
import { errorHandler } from './errors/errorHandler';

export const app: express.Application = express();
export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const uri: string = 'mongodb://localhost:27017/';
const DB_NAME: string = 'mydb';

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose
  .connect(uri + DB_NAME)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));

app.use(apiEndpoints.HEALTH_CHECK, healthCheckRoute);
app.use(apiEndpoints.MOVIES, moviesRouter);
app.use(apiEndpoints.GENRES, genresRouter);
app.use(errorHandler);

app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: apiErrors.NOT_FOUND });
});

export const server = app.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
