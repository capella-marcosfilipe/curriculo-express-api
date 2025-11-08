import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    createEducation,
    getEducations,
    updateEducation,
    deleteEducation,
} from '../controllers/educationController';

const router = Router();

router.use(protect);

router.route('/')
    .post(createEducation) // POST /api/educations
    .get(getEducations);   // GET /api/educations

router.route('/:id')
    .put(updateEducation)  // PUT /api/educations/:id
    .delete(deleteEducation); // DELETE /api/educations/:id

export default router;