import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';
import subjectRoutes from './subject.routes.js';
import assignmentRoutes from './assignment.routes.js';
import examRoutes from './exam.routes.js';
import attendanceRoutes from './attendance.routes.js';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/subjects', subjectRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/exams', examRoutes);
router.use('/attendance', attendanceRoutes);

export default router;