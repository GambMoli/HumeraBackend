import { Router } from 'express';
import authRoutes from './AuthRoutes';
import projectRoutes from './ProjectRoutes';
import taskRoutes from './TaskRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);


export default router;
