import { Router } from 'express';
import {
  createAssignment,
  deleteAssignment,
  getAssignment,
  getAssignments,
  updateAssignment,
} from '../controllers/assignment.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

export default router;