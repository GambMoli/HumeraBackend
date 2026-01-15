import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/TaskController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('', authenticate, createTask);
router.get('/:projectId', authenticate, getTasks);
router.patch('/:taskId', authenticate, updateTask);
router.delete('/:taskId', authenticate, deleteTask);

export default router;