import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swaggerOptions';
import express, { Request, Response } from 'express';

import healthCheckRoute from './routes/healthCheck';
import usersRoute from './routes/users';
import { apiEndpoints, apiErrors } from './constants';

const app: express.Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(apiEndpoints.HEALTH_CHECK, healthCheckRoute);
app.use(apiEndpoints.USERS, usersRoute);

app.use((req: Request, res: Response): void => {
  const errorResponse: { error: string } = { error: apiErrors.NOT_FOUND };
  res.status(404).json(errorResponse);
});

app.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
