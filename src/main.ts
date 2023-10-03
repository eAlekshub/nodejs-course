import swaggerDoc from './swagger.json';
import swaggerUi from 'swagger-ui-express';
import express, { Request, Response } from 'express';

const app: express.Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/health-check', (req: Request, res: Response): void => {
  const response: { status: string } = { status: 'Server is up and running' };
  res.json(response);
});

app.get('/user/:id', (req: Request, res: Response): void => {
  try {
    const userId: string = req.params.id;

    if (userId === 'error') {
      throw new Error('Something went wrong');
    }

    if (userId !== '1') {
      const errorResponse: { error: string } = { error: 'Not Found' };
      res.status(404).json(errorResponse);
    } else {
      const user: { id: string; name: string } = { id: userId, name: 'User name' };
      res.json(user);
    }
  } catch (error) {
    const errorResponse: { error: string } = { error: 'Internal Server Error' };
    res.status(500).json(errorResponse);
  }
});

app.use((req: Request, res: Response): void => {
  const errorResponse: { error: string } = { error: 'Not Found' };
  res.status(404).json(errorResponse);
});

app.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
