import {
  examsStore,
  subjectsStore,
} from '../services/plannerStore.js';

const TITLE_MAX = 160;
const LOCATION_MAX = 120;
const NOTES_MAX = 2000;

function cleanText(value, max) {
  if (typeof value !== 'string') return undefined;
  const clean = value.trim();
  return clean.length === 0 ? '' : clean.slice(0, max);
}

function parseIsoDate(value) {
  if (value === null || value === undefined || value === '') return null;
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return null;
  return new Date(timestamp).toISOString();
}

async function subjectOwnedBy(userId, subjectId) {
  if (!subjectId) return false;
  const subject = await subjectsStore.find(userId, String(subjectId));
  return Boolean(subject);
}

export async function createExam(req, res) {
  const { subject, title, examDate, location, notes } = req.body || {};

  if (!(await subjectOwnedBy(req.userId, subject))) {
    return res.status(400).json({ error: 'Please choose a subject for this exam.' });
  }

  const cleanTitle = cleanText(title, TITLE_MAX);
  if (!cleanTitle) {
    return res.status(400).json({ error: 'Please enter an exam title.' });
  }

  const cleanDate = parseIsoDate(examDate);
  if (examDate !== undefined && examDate !== null && examDate !== '' && !cleanDate) {
    return res.status(400).json({ error: 'Please enter a valid exam date.' });
  }

  const cleanLocation = cleanText(location, LOCATION_MAX);
  const cleanNotes = cleanText(notes, NOTES_MAX);

  const exam = await examsStore.insert({
    user: req.userId,
    subject: String(subject),
    title: cleanTitle,
    examDate: cleanDate,
    location: cleanLocation || null,
    notes: cleanNotes || null,
  });

  return res.status(201).json({ exam });
}

export async function getExams(req, res) {
  let exams = await examsStore.list(req.userId);

  const { subject, sort = 'examDate', order = 'asc' } = req.query || {};

  if (subject) {
    const wanted = String(subject);
    exams = exams.filter((exam) => exam.subject === wanted);
  }

  const direction = order === 'desc' ? -1 : 1;
  const keyFor = {
    examDate: (exam) => (exam.examDate ? new Date(exam.examDate).getTime() : Infinity),
    title: (exam) => exam.title.toLowerCase(),
    createdAt: (exam) => new Date(exam.createdAt).getTime(),
  };
  const key = keyFor[sort] || keyFor.examDate;

  exams.sort((a, b) => {
    const aKey = key(a);
    const bKey = key(b);
    if (aKey < bKey) return -1 * direction;
    if (aKey > bKey) return 1 * direction;
    return 0;
  });

  return res.json({ exams });
}

export async function getExam(req, res) {
  const exam = await examsStore.find(req.userId, req.params.id);
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found.' });
  }
  return res.json({ exam });
}

export async function updateExam(req, res) {
  const existing = await examsStore.find(req.userId, req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Exam not found.' });
  }

  const { subject, title, examDate, location, notes } = req.body || {};
  const changes = {};

  if (subject !== undefined) {
    if (!(await subjectOwnedBy(req.userId, subject))) {
      return res.status(400).json({ error: 'Please choose a subject for this exam.' });
    }
    changes.subject = String(subject);
  }

  if (title !== undefined) {
    const cleanTitle = cleanText(title, TITLE_MAX);
    if (!cleanTitle) {
      return res.status(400).json({ error: 'Please enter an exam title.' });
    }
    changes.title = cleanTitle;
  }

  if (examDate !== undefined) {
    const cleanDate = parseIsoDate(examDate);
    if (examDate !== null && examDate !== '' && !cleanDate) {
      return res.status(400).json({ error: 'Please enter a valid exam date.' });
    }
    changes.examDate = cleanDate;
  }

  if (location !== undefined) {
    const cleanLocation = cleanText(location, LOCATION_MAX);
    changes.location = cleanLocation || null;
  }

  if (notes !== undefined) {
    const cleanNotes = cleanText(notes, NOTES_MAX);
    changes.notes = cleanNotes || null;
  }

  const exam = await examsStore.update(req.userId, req.params.id, changes);
  return res.json({ exam });
}

export async function deleteExam(req, res) {
  const removed = await examsStore.remove(req.userId, req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Exam not found.' });
  }
  return res.status(204).end();
}