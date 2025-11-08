import { Request, Response } from 'express';
import Statement from '../models/StatementModel';
import User from '../models/UserModel';

// @desc    Create new statement
// @route   POST /api/statements
export const createStatement = async (req: Request, res: Response) => {
    try {
        const { title, text } = req.body;
        const userId = (req.user as User).id;

        if (!title || !text) {
            return res.status(400).json({ message: 'Title and text are required' });
        }

        const newStatement = await Statement.create({
            title,
            text,
            userId: userId,
        });

        res.status(201).json(newStatement);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all user statements
// @route   GET /api/statements
export const getStatements = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User).id;
        const statements = await Statement.findAll({ where: { userId: userId } });
        res.status(200).json(statements);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a statement
// @route   PUT /api/statements/:id
export const updateStatement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id;
        const { title, text } = req.body;

        const statement = await Statement.findOne({ where: { id: id, userId: userId } });

        if (!statement) {
            return res.status(404).json({ message: 'Statement not found or does not belong to this user' });
        }

        statement.title = title || statement.title;
        statement.text = text || statement.text;

        await statement.save();
        res.status(200).json(statement);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a statement
// @route   DELETE /api/statements/:id
export const deleteStatement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id;

        const statement = await Statement.findOne({ where: { id: id, userId: userId } });

        if (!statement) {
            return res.status(404).json({ message: 'Statement not found or does not belong to this user' });
        }

        await statement.destroy();
        res.status(200).json({ message: 'Statement deleted successfully', id: id });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};