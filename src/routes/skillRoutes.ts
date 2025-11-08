import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import { 
    createSkill, 
    getSkills, 
    updateSkill, 
    deleteSkill 
} from '../controllers/skillController';

const router = Router();

router.use(protect);

router.route('/')
    .post(createSkill) // POST /api/skills
    .get(getSkills); // GET /api/skills

router.route('/:id')
    .put(updateSkill) // PUT /api/skills/:id
    .delete(deleteSkill); // DELETE /api/skills/:id

export default router;