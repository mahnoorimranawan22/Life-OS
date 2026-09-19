import {
  assignmentsStore,
  attendanceStore,
  examsStore,
  subjectsStore,
} from '../services/plannerStore.js';

const NAME_MAX = 120;
const CODE_MAX = 30;
const INSTRUCTOR_MAX = 100;
const SEMESTER_MAX = 60;

const COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const DEFAULT_COLOR = '#174a3a';

function cleanText(value, max) {
  if (typeof value !== 'string') return undefined;
  const clean = value.trim();
  return clean.length === 0 ? '' : clean.slice(0, max);
}

function cleanCreditHours(value) {
  if (value === undefined || value === null || value === '') return 0;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 30) return undefined;
  return Math.round(number * 2) / 2;
}

export async function createSubject(req, res) {
  const { name, code, instructor, creditHours, semester, color } = req.body || {};

  const cleanName = cleanText(name, NAME_MAX);
  if (!cleanName) {
    return res.status(400).json({ error: 'Please enter a subject name.' });
  }
  const cleanCode = cleanText(code, CODE_MAX);
  const cleanInstructor = cleanText(instructor, INSTRUCTOR_MAX);
  const cleanSemester = cleanText(semester, SEMESTER_MAX);
  const cleanCredits = cleanCreditHours(creditHours);
  if (cleanCredits === undefined) {
    return res.status(400).json({ error: 'Credit hours must be a number between 0 and 30.' });
  }

  let cleanColor = DEFAULT_COLOR;
  if (color !== undefined && color !== null && color !== '') {
    cleanColor = String(color).trim();
    if (!COLOR_PATTERN.test(cleanColor)) {
      return res.status(400).json({ error: 'Please choose a valid subject color.' });
    }
  }

  const subject = await subjectsStore.insert({
    user: req.userId,
    name: cleanName,
    code: cleanCode || null,
    instructor: cleanInstructor || null,
    creditHours: cleanCredits,
    semester: cleanSemester || null,
    color: cleanColor,
  });

  return res.status(201).json({ subject });
}

export async function getSubjects(req, res) {
  let subjects = await subjectsStore.list(req.userId);
  const { semester, sort = 'name', order = 'asc' } = req.query || {};

  if (semester) {
    const wanted = String(semester).trim().toLowerCase();
    if (wanted) {
      subjects = subjects.filter(
        (subject) => subject.semester && subject.semester.toLowerCase() === wanted
      );
    }
  }

  const direction = order === 'desc' ? -1 : 1;
  const keyFor = {
    name: (subject) => (subject.name || '').toLowerCase(),
    semester: (subject) => (subject.semester || '').toLowerCase(),
    createdAt: (subject) => new Date(subject.createdAt).getTime(),
  };
  const key = keyFor[sort] || keyFor.name;
  subjects.sort((a, b) => {
    const aKey = key(a);
    const bKey = key(b);
    if (aKey < bKey) return -1 * direction;
    if (aKey > bKey) return 1 * direction;
    return 0;
  });

  return res.json({ subjects });
}

export async function getSubject(req, res) {
  const subject = await subjectsStore.find(req.userId, req.params.id);
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found.' });
  }
  return res.json({ subject });
}

export async function updateSubject(req, res) {
  const existing = await subjectsStore.find(req.userId, req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Subject not found.' });
  }

  const { name, code, instructor, creditHours, semester, color } = req.body || {};
  const changes = {};

  if (name !== undefined) {
    const cleanName = cleanText(name, NAME_MAX);
    if (!cleanName) {
      return res.status(400).json({ error: 'Please enter a subject name.' });
    }
    changes.name = cleanName;
  }

  if (code !== undefined) {
    const cleanCode = cleanText(code, CODE_MAX);
    changes.code = cleanCode || null;
  }
  if (instructor !== undefined) {
    const cleanInstructor = cleanText(instructor, INSTRUCTOR_MAX);
    changes.instructor = cleanInstructor || null;
  }
  if (semester !== undefined) {
    const cleanSemester = cleanText(semester, SEMESTER_MAX);
    changes.semester = cleanSemester || null;
  }

  if (creditHours !== undefined) {
    const cleanCredits = cleanCreditHours(creditHours);
    if (cleanCredits === undefined) {
      return res.status(400).json({ error: 'Credit hours must be a number between 0 and 30.' });
    }
    changes.creditHours = cleanCredits;
  }

  if (color !== undefined) {
    if (color === null || color === '') {
      changes.color = DEFAULT_COLOR;
    } else {
      const cleanColor = String(color).trim();
      if (!COLOR_PATTERN.test(cleanColor)) {
        return res.status(400).json({ error: 'Please choose a valid subject color.' });
      }
      changes.color = cleanColor;
    }
  }

  const subject = await subjectsStore.update(req.userId, req.params.id, changes);
  return res.json({ subject });
}

export async function deleteSubject(req, res) {
  const removed = await subjectsStore.remove(req.userId, req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Subject not found.' });
  }
  // Cascade: drop planner items that only make sense while the subject exists.
  await assignmentsStore.removeWhere(req.userId, (doc) => doc.subject === req.params.id);
  await examsStore.removeWhere(req.userId, (doc) => doc.subject === req.params.id);
  await attendanceStore.removeWhere(req.userId, (doc) => doc.subject === req.params.id);
  return res.status(204).end();
}