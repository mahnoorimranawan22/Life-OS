import {
  attendanceStore,
  subjectsStore,
} from '../services/plannerStore.js';

const MAX_CLASSES = 5000;

function cleanCount(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > MAX_CLASSES) return undefined;
  return number;
}

async function subjectOwnedBy(userId, subjectId) {
  if (!subjectId) return false;
  const subject = await subjectsStore.find(userId, String(subjectId));
  return Boolean(subject);
}

export async function createAttendance(req, res) {
  const { subject, totalClasses, attendedClasses } = req.body || {};

  if (!(await subjectOwnedBy(req.userId, subject))) {
    return res.status(400).json({ error: 'Please choose a subject.' });
  }

  const existing = (await attendanceStore.list(req.userId)).find(
    (record) => record.subject === String(subject)
  );
  if (existing) {
    return res.json({ attendance: existing });
  }

  const cleanTotal = cleanCount(totalClasses, 0);
  if (cleanTotal === undefined) {
    return res.status(400).json({ error: 'Total classes must be a whole number 0–5000.' });
  }
  const cleanAttended = cleanCount(attendedClasses, 0);
  if (cleanAttended === undefined) {
    return res.status(400).json({ error: 'Attended classes must be a whole number 0–5000.' });
  }
  if (cleanAttended > cleanTotal) {
    return res.status(400).json({ error: 'Attended classes cannot exceed total classes.' });
  }

  const attendance = await attendanceStore.insert({
    user: req.userId,
    subject: String(subject),
    totalClasses: cleanTotal,
    attendedClasses: cleanAttended,
  });

  return res.status(201).json({ attendance });
}

export async function getAttendance(req, res) {
  const attendance = await attendanceStore.list(req.userId);
  return res.json({ attendance });
}

export async function getAttendanceForSubject(req, res) {
  if (!(await subjectOwnedBy(req.userId, req.params.subjectId))) {
    return res.status(404).json({ error: 'Subject not found.' });
  }
  const records = await attendanceStore.list(req.userId);
  const attendance =
    records.find((record) => record.subject === req.params.subjectId) || null;
  return res.json({ attendance });
}

export async function updateAttendance(req, res) {
  const existing = await attendanceStore.find(req.userId, req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Attendance record not found.' });
  }

  const { totalClasses, attendedClasses } = req.body || {};
  const changes = {};

  if (totalClasses !== undefined) {
    const cleanTotal = cleanCount(totalClasses);
    if (cleanTotal === undefined) {
      return res.status(400).json({ error: 'Total classes must be a whole number 0–5000.' });
    }
    changes.totalClasses = cleanTotal;
  }
  if (attendedClasses !== undefined) {
    const cleanAttended = cleanCount(attendedClasses);
    if (cleanAttended === undefined) {
      return res.status(400).json({ error: 'Attended classes must be a whole number 0–5000.' });
    }
    changes.attendedClasses = cleanAttended;
  }

  const nextTotal = changes.totalClasses !== undefined ? changes.totalClasses : existing.totalClasses;
  const nextAttended =
    changes.attendedClasses !== undefined ? changes.attendedClasses : existing.attendedClasses;
  if (nextAttended > nextTotal) {
    return res.status(400).json({ error: 'Attended classes cannot exceed total classes.' });
  }

  const attendance = await attendanceStore.update(req.userId, req.params.id, changes);
  return res.json({ attendance });
}

export async function recordAttendance(req, res) {
  const existing = await attendanceStore.find(req.userId, req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Attendance record not found.' });
  }

  const { present } = req.body || {};
  if (typeof present !== 'boolean') {
    return res.status(400).json({ error: 'Choose whether you attended this class.' });
  }

  const total = existing.totalClasses + 1;
  const attended = existing.attendedClasses + (present ? 1 : 0);

  const attendance = await attendanceStore.update(req.userId, req.params.id, {
    totalClasses: total,
    attendedClasses: attended,
  });
  return res.json({ attendance });
}

export async function deleteAttendance(req, res) {
  const removed = await attendanceStore.remove(req.userId, req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Attendance record not found.' });
  }
  return res.status(204).end();
}