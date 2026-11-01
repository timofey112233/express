import { Router } from 'express';
import {
    getTasks, 
    getTskById,
    createTask,
} from '../controllers/tasks.js';

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTasksById);
router.post('/', createTask);

export default router;