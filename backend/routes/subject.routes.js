import { Router } from 'express';
import {
  createSubject,
  deleteSubject,
  getSubject,
  getSubjects,
  updateSubject,
} from '../controllers/subject.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', createSubject);
router.get('/', getSubjects);
router.get('/:id', getSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;