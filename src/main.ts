import swaggerDoc from './swagger.json';
import swaggerUi from 'swagger-ui-express';
import express, { Request, Response } from 'express';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/health-check', (req: Request, res: Response): void => {
  res.json({ status: 'Server is up and running' });
});

app.get('/user/:id', (req: Request, res: Response): void => {
  try {
    const userId: string = req.params.id;

    if (userId === 'error') {
      throw new Error('Something went wrong');
    }

    if (userId !== '1') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ user: { id: userId, name: 'User name' } });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
