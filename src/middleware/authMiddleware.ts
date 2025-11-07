import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';

interface JwtPayload {
    id: string;
    email: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT secret not defined');
            }
            
            const decoded = jwt.verify(token, secret) as JwtPayload;

            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });
            
            if (!req.user) {
                 return res.status(401).json({ message: 'User not found' });
            }

            next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};
