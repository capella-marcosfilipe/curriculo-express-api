import { Request, Response } from "express";
import Education from "../models/EducationModel";
import User from "../models/UserModel";

/**
 * @desc    Criar novo item de educação
 * @route   POST /api/educations
 * @access  Privado
 */
export const createEducation = async (req: Request, res: Response) => {
  try {
    const { institution, degree, fieldOfStudy, startDate, endDate } = req.body;
    // Get user ID from authenticated user
    const userId = (req.user as User).id;

    if (!institution || !degree || !fieldOfStudy || !startDate) {
      return res.status(400).json({ message: 'Institution, degree, field of study, and start date are required' });
    }

    const newEducation = await Education.create({
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate: endDate || null,
      userId: userId,
    });

    res.status(201).json(newEducation);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Buscar todos os itens de educação do usuário logado
 * @route   GET /api/educations
 * @access  Privado
 */
export const getEducations = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;

    const educations = await Education.findAll({
      where: { userId: userId }, // Apenas os itens deste usuário
      order: [['startDate', 'DESC']], // Ordena pelos mais recentes
    });

    res.status(200).json(educations);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Atualizar um item de educação
 * @route   PUT /api/educations/:id
 * @access  Privado
 */
export const updateEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Education ID from URL
    const userId = (req.user as User).id;
    const { institution, degree, fieldOfStudy, startDate, endDate } = req.body;

    // 1. Find item
    const education = await Education.findOne({
      where: { id: id, userId: userId } // CRITICAL: Check if the item belongs to the user
    });

    if (!education) {
      return res.status(404).json({ message: 'Education item not found or does not belong to this user' });
    }

    // 2. Atualizar o item
    education.institution = institution || education.institution;
    education.degree = degree || education.degree;
    education.fieldOfStudy = fieldOfStudy || education.fieldOfStudy;
    education.startDate = startDate || education.startDate;
    education.endDate = endDate || education.endDate;

    await education.save();

    res.status(200).json(education);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Deletar um item de educação
 * @route   DELETE /api/educations/:id
 * @access  Privado
 */
export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as User).id;

    // 1. Find the item
    const education = await Education.findOne({
      where: { id: id, userId: userId } // CRITICAL: Check if the item belongs to the user
    });

    if (!education) {
      return res.status(404).json({ message: 'Education item not found or does not belong to this user' });
    }

    // 2. Delete the item
    await education.destroy();

    res.status(200).json({ message: 'Education item deleted successfully', id: id });
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};