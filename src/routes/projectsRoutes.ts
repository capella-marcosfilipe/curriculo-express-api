import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import { 
    createProject, 
    getProjects, 
    updateProject, 
    deleteProject 
} from '../controllers/projectController';

const router = Router();

router.use(protect);

router.route('/')
    .post(createProject) // POST /api/projects
    .get(getProjects); // GET /api/projects

router.route('/:id')
    .put(updateProject) // PUT /api/projects/:id
    .delete(deleteProject); // DELETE /api/projects/:id

export default router;