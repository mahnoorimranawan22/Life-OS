import { Router } from 'express';
import {
  createExam,
  deleteExam,
  getExam,
  getExams,
  updateExam,
} from '../controllers/exam.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', createExam);
router.get('/', getExams);
router.get('/:id', getExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;