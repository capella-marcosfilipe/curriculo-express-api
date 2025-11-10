import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Curriculum from '../models/CurriculumModel';
import Statement from '../models/StatementModel';
import Education from '../models/EducationModel';
import Experience from '../models/ExperienceModel';
import Skill from '../models/SkillModel';
import Project from '../models/ProjectModel';
import User from '../models/UserModel';

// 1. Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * @desc    Generate a new statement with AI
 * @route   POST /api/ai/generate-statement
 * @access  Private
 */
export const generateStatement = async (req: Request, res: Response) => {
    try {
        const { curriculumId, jobDescription, title } = req.body;
        const userId = (req.user as User).id;

        if (!curriculumId || !jobDescription || !title) {
            return res.status(400).json({ message: 'curriculumId, jobDescription, and title are required' });
        }

        // 2. Fetch complete curriculum (as in getById)
        const curriculum = await Curriculum.findOne({
            where: { id: curriculumId, userId: userId },
            include: [
                { model: Education, as: 'educations', through: { attributes: [] } },
                { model: Experience, as: 'experiences', through: { attributes: [] } },
                { model: Skill, as: 'skills', through: { attributes: [] } },
                { model: Project, as: 'projects', through: { attributes: [] } },
            ]
        });

        if (!curriculum) {
            return res.status(404).json({ message: 'Curriculum not found' });
        }

        // 3. Build the prompt
        // (Convert curriculum JSON to text for AI understanding)
        const curriculumText = JSON.stringify(curriculum.toJSON(), null, 2);

        const prompt = `
            **Contexto:**
            Você é um assistente de carreira especialista em criar resumos (statements) de currículo.
            Seu objetivo é criar um resumo curto (3-4 frases), impactante e profissional que conecte as qualificações do candidato com os requisitos da vaga.

            **Tarefa:**
            Analise o currículo do candidato e a descrição da vaga fornecida.
            Gere um resumo (statement) que destaque como as experiências, habilidades e projetos do candidato o tornam perfeito para esta vaga específica.
            Seja direto e use linguagem profissional.

            ---
            **Currículo do Candidato (JSON):**
            ${curriculumText}
            ---
            **Descrição da Vaga:**
            ${jobDescription}
            ---

            **Resumo Gerado (apenas o texto):**
        `;

        // 4. Call the AI
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();

        // 5. Save the new statement to database
        const newStatement = await Statement.create({
            title: title, // Title given by user (e.g., "Statement for Position X")
            text: generatedText,
            userId: userId,
        });

        // 6. Return the newly created statement
        res.status(201).json(newStatement);

    } catch (error: any) {
        console.error('Error generating statement with AI:', error);
        res.status(500).json({ message: 'Server error while generating statement', error: error.message });
    }
};