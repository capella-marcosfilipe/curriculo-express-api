import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import { 
    createExperience, 
    getExperiences, 
    updateExperience, 
    deleteExperience 
} from '../controllers/experienceController';

const router = Router();

router.use(protect);

router.route('/')
    .post(createExperience) // POST /api/experiences
    .get(getExperiences);   // GET /api/experiences

router.route('/:id')
    .put(updateExperience)  // PUT /api/experiences/:id
    .delete(deleteExperience); // DELETE /api/experiences/:id

export default router;