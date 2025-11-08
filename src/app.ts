import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import educationRoutes from './routes/educationRoutes';
import experienceRoutes from './routes/experienceRoutes';
import skillRoutes from './routes/skillRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('CV Backend API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/educations', educationRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/skills', skillRoutes);

export default app;