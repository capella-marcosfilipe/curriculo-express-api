import { Request, Response } from 'express';
import Curriculum from '../models/CurriculumModel';
import Statement from '../models/StatementModel';
import User from '../models/UserModel';
import Education from '../models/EducationModel';
import Experience from '../models/ExperienceModel';
import Skill from '../models/SkillModel';
import Project from '../models/ProjectModel';
import sequelize from '../config/database'; 
import { Model } from 'sequelize';

// --- BASIC CURRICULUM CRUD ---

// @desc    Create new curriculum
// @route   POST /api/curriculums
export const createCurriculum = async (req: Request, res: Response) => {
    try {
        const { title, statementId } = req.body; // Requires a title and a statement ID
        const userId = (req.user as User).id;

        if (!title || !statementId) {
            return res.status(400).json({ message: 'Title and statement ID are required' });
        }

        // Check if the statement belongs to the user
        const statement = await Statement.findOne({ where: { id: statementId, userId: userId } });
        if (!statement) {
            return res.status(404).json({ message: 'Statement not found or does not belong to this user' });
        }

        const newCurriculum = await Curriculum.create({
            title,
            statementId,
            userId: userId,
        });

        res.status(201).json(newCurriculum);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all user curriculums
// @route   GET /api/curriculums
export const getCurriculums = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User).id;
        const curriculums = await Curriculum.findAll({ where: { userId: userId } });
        res.status(200).json(curriculums);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a curriculum
// @route   DELETE /api/curriculums/:id
export const deleteCurriculum = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id;

        const curriculum = await Curriculum.findOne({ where: { id: id, userId: userId } });
        if (!curriculum) {
            return res.status(404).json({ message: 'Curriculum not found' });
        }

        await curriculum.destroy();
        res.status(200).json({ message: 'Curriculum deleted successfully', id: id });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a COMPLETE curriculum by ID
// @route   GET /api/curriculums/:id
export const getCurriculumById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id;

        const curriculum = await Curriculum.findOne({
            where: { id: id, userId: userId },
            // Here's the magic: Eager Loading
            // We fetch the curriculum AND all its associated items
            include: [
                { model: Statement, as: 'statement' }, // The summary (1:1)
                { model: Education, as: 'educations', through: { attributes: [] } }, // N:M
                { model: Experience, as: 'experiences', through: { attributes: [] } }, // N:M
                { model: Skill, as: 'skills', through: { attributes: [] } }, // N:M
                { model: Project, as: 'projects', through: { attributes: [] } }, // N:M
            ]
        });

        if (!curriculum) {
            return res.status(404).json({ message: 'Curriculum not found' });
        }

        res.status(200).json(curriculum);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- N:M RELATIONSHIP MANAGEMENT ---

const manageAssociation = async (
    req: Request,
    res: Response,
    action: 'add' | 'remove',
    curriculumId: string,
    itemId: string,
    model: typeof Model & { findOne: any },
    associationName: string // 'Education', 'Experience', etc.
) => {
    const userId = (req.user as User).id;

    const t = await sequelize.transaction();

    try {
        // 1. Check if the Curriculum belongs to the user
        const curriculum = await Curriculum.findOne({
            where: { id: curriculumId, userId: userId },
            transaction: t
        });
        if (!curriculum) {
            await t.rollback();
            return res.status(404).json({ message: 'Curriculum not found' });
        }

        // 2. Check if the Item (Education, Skill, etc.) belongs to the user
        const item = await model.findOne({
            where: { id: itemId, userId: userId },
            transaction: t
        });
        if (!item) {
            await t.rollback();
            return res.status(404).json({ message: `${associationName} not found or does not belong to this user` });
        }

        // 3. Execute the action (Add or Remove)
        // Sequelize has magic methods like 'addEducation', 'removeSkill'
        const methodName = `${action}${associationName}`; // e.g.: "addEducation", "removeSkill"
        
        if (typeof (curriculum as any)[methodName] !== 'function') {
            throw new Error(`Invalid association method: ${methodName}`);
        }

        await (curriculum as any)[methodName](item, { transaction: t });
        
        // If everything went well, commit the transaction
        await t.commit();
        
        const messageAction = action === 'add' ? 'added to' : 'removed from';
        res.status(200).json({ message: `${associationName} ${messageAction} curriculum successfully.` });

    } catch (error: any) {
        await t.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- Association Endpoints (Education) ---
export const addEducationToCurriculum = (req: Request, res: Response) => {
    const { curriculumId, educationId } = req.params;
    manageAssociation(req, res, 'add', curriculumId, educationId, Education, 'Education');
};
export const removeEducationFromCurriculum = (req: Request, res: Response) => {
    const { curriculumId, educationId } = req.params;
    manageAssociation(req, res, 'remove', curriculumId, educationId, Education, 'Education');
};

// --- Association Endpoints (Experience) ---
export const addExperienceToCurriculum = (req: Request, res: Response) => {
    const { curriculumId, experienceId } = req.params;
    manageAssociation(req, res, 'add', curriculumId, experienceId, Experience, 'Experience');
};
export const removeExperienceFromCurriculum = (req: Request, res: Response) => {
    const { curriculumId, experienceId } = req.params;
    manageAssociation(req, res, 'remove', curriculumId, experienceId, Experience, 'Experience');
};

// --- Association Endpoints (Skill) ---
export const addSkillToCurriculum = (req: Request, res: Response) => {
    const { curriculumId, skillId } = req.params;
    manageAssociation(req, res, 'add', curriculumId, skillId, Skill, 'Skill');
};
export const removeSkillFromCurriculum = (req: Request, res: Response) => {
    const { curriculumId, skillId } = req.params;
    manageAssociation(req, res, 'remove', curriculumId, skillId, Skill, 'Skill');
};

// --- Association Endpoints (Project) ---
export const addProjectToCurriculum = (req: Request, res: Response) => {
    const { curriculumId, projectId } = req.params;
    manageAssociation(req, res, 'add', curriculumId, projectId, Project, 'Project');
};
export const removeProjectFromCurriculum = (req: Request, res: Response) => {
    const { curriculumId, projectId } = req.params;
    manageAssociation(req, res, 'remove', curriculumId, projectId, Project, 'Project');
};