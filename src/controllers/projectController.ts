import { Request, Response } from 'express';
import Project from '../models/ProjectModel';
import User from '../models/UserModel';

// @desc    Create new project
// @route   POST /api/projects
export const createProject = async (req: Request, res: Response) => {
    try {
        const { name, description, url } = req.body;
        const userId = (req.user as User).id;

        if (!name) {
            return res.status(400).json({ message: 'Project name is required' });
        }

        const newProject = await Project.create({
            name,
            description: description || null,
            url: url || null,
            userId: userId,
        });

        res.status(201).json(newProject);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all user projects
// @route   GET /api/projects
export const getProjects = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User).id;
        const projects = await Project.findAll({ where: { userId: userId } });
        res.status(200).json(projects);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id;
        const { name, description, url } = req.body;

        const project = await Project.findOne({ where: { id: id, userId: userId } });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or does not belong to this user' });
        }

        project.name = name || project.name;
        project.description = description;
        project.url = url;

        await project.save();
        res.status(200).json(project);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id;

        const project = await Project.findOne({ where: { id: id, userId: userId } });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or does not belong to this user' });
        }

        await project.destroy();
        res.status(200).json({ message: 'Project deleted successfully', id: id });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};