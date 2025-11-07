import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.use('/api/auth', authRoutes);

export default app;