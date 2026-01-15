import { Router } from 'express';
import { createProject, getProjects } from '../controllers/ProjectController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/create', authenticate, createProject);
router.get('', authenticate, getProjects);

export default router;
