import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
    createCurriculum,
    getCurriculums,
    getCurriculumById,
    deleteCurriculum,
    addEducationToCurriculum,
    removeEducationFromCurriculum,
    addExperienceToCurriculum,
    removeExperienceFromCurriculum,
    addSkillToCurriculum,
    removeSkillFromCurriculum,
    addProjectToCurriculum,
    removeProjectFromCurriculum
} from '../controllers/curriculumController';

const router = Router();
router.use(protect);

// --- Basic CRUD routes ---
router.route('/')
    .post(createCurriculum) // POST /api/curriculums
    .get(getCurriculums);   // GET /api/curriculums

router.route('/:id')
    .get(getCurriculumById) // GET /api/curriculums/:id (O COMPLETO)
    .delete(deleteCurriculum); // DELETE /api/curriculums/:id

// --- Association Routes (N:M) ---

// Education
router.route('/:curriculumId/educations/:educationId')
    .post(addEducationToCurriculum)    // POST /api/curriculums/123/educations/456
    .delete(removeEducationFromCurriculum); // DELETE /api/curriculums/123/educations/456

// Experience
router.route('/:curriculumId/experiences/:experienceId')
    .post(addExperienceToCurriculum) // POST /api/curriculums/123/experiences/456
    .delete(removeExperienceFromCurriculum); // DELETE /api/curriculums/123/experiences/456

// Skill
router.route('/:curriculumId/skills/:skillId')
    .post(addSkillToCurriculum) // POST /api/curriculums/123/skills/456
    .delete(removeSkillFromCurriculum); // DELETE /api/curriculums/123/skills/456

// Project
router.route('/:curriculumId/projects/:projectId')
    .post(addProjectToCurriculum) // POST /api/curriculums/123/projects/456
    .delete(removeProjectFromCurriculum); // DELETE /api/curriculums/123/projects/456

export default router;