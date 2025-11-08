import { Request, Response } from 'express';
import Skill from '../models/SkillModel';
import User from '../models/UserModel';

// @desc    Create new skill
// @route   POST /api/skills
export const createSkill = async (req: Request, res: Response) => {
    try {
        const { name, level } = req.body;
        const userId = (req.user as User).id;

        if (!name) {
            return res.status(400).json({ message: 'Skill name is required' });
        }

        const newSkill = await Skill.create({
            name,
            level: level || null,
            userId: userId,
        });

        res.status(201).json(newSkill);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all user skills
// @route   GET /api/skills
export const getSkills = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User).id;
        const skills = await Skill.findAll({ where: { userId: userId } });
        res.status(200).json(skills);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
export const updateSkill = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id;
        const { name, level } = req.body;

        const skill = await Skill.findOne({ where: { id: id, userId: userId } });

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found or does not belong to this user' });
        }

        skill.name = name || skill.name;
        skill.level = level || skill.level;

        await skill.save();
        res.status(200).json(skill);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
export const deleteSkill = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id;

        const skill = await Skill.findOne({ where: { id: id, userId: userId } });

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found or does not belong to this user' });
        }

        await skill.destroy();
        res.status(200).json({ message: 'Skill deleted successfully', id: id });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};