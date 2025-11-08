import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
    createStatement,
    getStatements,
    updateStatement,
    deleteStatement
} from '../controllers/statementController';

const router = Router();

router.use(protect);

router.route('/')
    .post(createStatement)
    .get(getStatements);

router.route('/:id')
    .put(updateStatement)
    .delete(deleteStatement);

export default router;