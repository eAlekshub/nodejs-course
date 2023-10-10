import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swaggerOptions';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import { apiEndpoints, apiErrors } from './constants';

import healthCheckRoute from './routes/healthCheck';
import usersRoute from './routes/users';
import moviesRouter from './routes/movies';
import genresRouter from './routes/genres';

const app: express.Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const uri: string = 'mongodb://localhost:27017/';
const DB_NAME: string = 'mydb';

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose
  .connect(uri + DB_NAME)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));

app.use(apiEndpoints.HEALTH_CHECK, healthCheckRoute);
app.use(apiEndpoints.USERS, usersRoute);
app.use(apiEndpoints.MOVIES, moviesRouter);
app.use(apiEndpoints.GENRES, genresRouter);

app.use((req: Request, res: Response): void => {
  const errorResponse: { error: string } = { error: apiErrors.NOT_FOUND };
  res.status(404).json(errorResponse);
});

app.use((err: Error, req: Request, res: Response) => {
  const errorResponse: { error: string } = { error: apiErrors.SERVER_ERROR };
  res.status(500).json(errorResponse);
});

app.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
