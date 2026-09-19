import { Router } from 'express';
import {
  createAttendance,
  deleteAttendance,
  getAttendance,
  getAttendanceForSubject,
  recordAttendance,
  updateAttendance,
} from '../controllers/attendance.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', createAttendance);
router.get('/', getAttendance);
router.get('/subject/:subjectId', getAttendanceForSubject);
router.put('/:id', updateAttendance);
router.post('/:id/record', recordAttendance);
router.delete('/:id', deleteAttendance);

export default router;