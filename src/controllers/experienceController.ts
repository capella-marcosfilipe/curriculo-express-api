import { Request, Response } from 'express';
import Experience from '../models/ExperienceModel';
import User from '../models/UserModel';

/**
 * @desc    Create new experience
 * @route   POST /api/experiences
 * @access  Private
 */
export const createExperience = async (req: Request, res: Response) => {
    try {
        const { company, title, description, startDate, endDate } = req.body;
        const userId = (req.user as User).id;

        if (!company || !title || !startDate) {
            return res.status(400).json({ message: 'Company, title and start date are required' });
        }

        const newExperience = await Experience.create({
            company,
            title,
            description: description || null,
            startDate,
            endDate: endDate || null,
            userId: userId,
        });

        res.status(201).json(newExperience);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get all experiences for logged user
 * @route   GET /api/experiences
 * @access  Private
 */
export const getExperiences = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User).id;
        
        const experiences = await Experience.findAll({
            where: { userId: userId },
            order: [['startDate', 'DESC']],
        });

        res.status(200).json(experiences);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update an experience
 * @route   PUT /api/experiences/:id
 * @access  Private
 */
export const updateExperience = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id;
        const { company, title, description, startDate, endDate } = req.body;

        const experience = await Experience.findOne({
            where: { id: id, userId: userId }
        });

        if (!experience) {
            return res.status(404).json({ message: 'Experience not found or does not belong to this user' });
        }

        experience.company = company || experience.company;
        experience.title = title || experience.title;
        experience.description = description; // Allows update (or clear)
        experience.startDate = startDate || experience.startDate;
        experience.endDate = endDate; // Allows update (or clear)

        await experience.save();

        res.status(200).json(experience);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete an experience
 * @route   DELETE /api/experiences/:id
 * @access  Private
 */
export const deleteExperience = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id;

        const experience = await Experience.findOne({
            where: { id: id, userId: userId }
        });

        if (!experience) {
            return res.status(404).json({ message: 'Experience not found or does not belong to this user' });
        }

        await experience.destroy();

        res.status(200).json({ message: 'Experience deleted successfully', id: id });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};