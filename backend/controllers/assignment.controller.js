import {
  ASSIGNMENT_PRIORITIES,
  ASSIGNMENT_STATUSES,
  assignmentsStore,
  subjectsStore,
} from '../services/plannerStore.js';

const TITLE_MAX = 160;
const DESCRIPTION_MAX = 2000;

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

export async function createAssignment(req, res) {
  const { subject, title, description, dueDate, status, priority } = req.body || {};

  if (!(await subjectOwnedBy(req.userId, subject))) {
    return res.status(400).json({ error: 'Please choose a subject for this assignment.' });
  }

  const cleanTitle = cleanText(title, TITLE_MAX);
  if (!cleanTitle) {
    return res.status(400).json({ error: 'Please enter an assignment title.' });
  }

  let cleanStatus = 'todo';
  if (status !== undefined) {
    if (!ASSIGNMENT_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status must be todo, in-progress or completed.' });
    }
    cleanStatus = status;
  }

  let cleanPriority = 'medium';
  if (priority !== undefined) {
    if (!ASSIGNMENT_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: 'Priority must be low, medium or high.' });
    }
    cleanPriority = priority;
  }

  const cleanDescription = cleanText(description, DESCRIPTION_MAX);
  const cleanDue = parseIsoDate(dueDate);
  if (dueDate !== undefined && dueDate !== null && dueDate !== '' && !cleanDue) {
    return res.status(400).json({ error: 'Please enter a valid due date.' });
  }

  const assignment = await assignmentsStore.insert({
    user: req.userId,
    subject: String(subject),
    title: cleanTitle,
    description: cleanDescription || null,
    dueDate: cleanDue,
    status: cleanStatus,
    priority: cleanPriority,
    completedAt: cleanStatus === 'completed' ? new Date().toISOString() : null,
  });

  return res.status(201).json({ assignment });
}

export async function getAssignments(req, res) {
  let assignments = await assignmentsStore.list(req.userId);

  const {
    search,
    status,
    priority,
    subject,
    sort = 'dueDate',
    order = 'asc',
  } = req.query || {};

  if (search) {
    const query = String(search).trim().toLowerCase();
    if (query) {
      assignments = assignments.filter((assignment) =>
        [assignment.title, assignment.description]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }
  }
  if (ASSIGNMENT_STATUSES.includes(status)) {
    assignments = assignments.filter((assignment) => assignment.status === status);
  }
  if (ASSIGNMENT_PRIORITIES.includes(priority)) {
    assignments = assignments.filter((assignment) => assignment.priority === priority);
  }
  if (subject) {
    const wanted = String(subject);
    assignments = assignments.filter((assignment) => assignment.subject === wanted);
  }

  const direction = order === 'desc' ? -1 : 1;
  const keyFor = {
    dueDate: (assignment) => (assignment.dueDate ? new Date(assignment.dueDate).getTime() : Infinity),
    createdAt: (assignment) => new Date(assignment.createdAt).getTime(),
    priority: (assignment) => ASSIGNMENT_PRIORITIES.indexOf(assignment.priority),
    title: (assignment) => assignment.title.toLowerCase(),
  };
  const key = keyFor[sort] || keyFor.dueDate;

  // Completed assignments always sink to the bottom of the default view.
  assignments.sort((a, b) => {
    const aDone = a.status === 'completed' ? 1 : 0;
    const bDone = b.status === 'completed' ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    const aKey = key(a);
    const bKey = key(b);
    if (aKey < bKey) return -1 * direction;
    if (aKey > bKey) return 1 * direction;
    return 0;
  });

  return res.json({ assignments });
}

export async function getAssignment(req, res) {
  const assignment = await assignmentsStore.find(req.userId, req.params.id);
  if (!assignment) {
    return res.status(404).json({ error: 'Assignment not found.' });
  }
  return res.json({ assignment });
}

export async function updateAssignment(req, res) {
  const existing = await assignmentsStore.find(req.userId, req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Assignment not found.' });
  }

  const { subject, title, description, dueDate, status, priority } = req.body || {};
  const changes = {};

  if (subject !== undefined) {
    if (!(await subjectOwnedBy(req.userId, subject))) {
      return res.status(400).json({ error: 'Please choose a subject for this assignment.' });
    }
    changes.subject = String(subject);
  }

  if (title !== undefined) {
    const cleanTitle = cleanText(title, TITLE_MAX);
    if (!cleanTitle) {
      return res.status(400).json({ error: 'Please enter an assignment title.' });
    }
    changes.title = cleanTitle;
  }

  if (description !== undefined) {
    const cleanDescription = cleanText(description, DESCRIPTION_MAX);
    changes.description = cleanDescription || null;
  }

  if (status !== undefined) {
    if (!ASSIGNMENT_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status must be todo, in-progress or completed.' });
    }
    changes.status = status;
  }

  if (priority !== undefined) {
    if (!ASSIGNMENT_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: 'Priority must be low, medium or high.' });
    }
    changes.priority = priority;
  }

  if (dueDate !== undefined) {
    const cleanDue = parseIsoDate(dueDate);
    if (dueDate !== null && dueDate !== '' && !cleanDue) {
      return res.status(400).json({ error: 'Please enter a valid due date.' });
    }
    changes.dueDate = cleanDue;
  }

  const nextStatus = changes.status !== undefined ? changes.status : existing.status;
  if (nextStatus === 'completed' && existing.status !== 'completed') {
    changes.completedAt = new Date().toISOString();
  } else if (nextStatus !== 'completed' && existing.status === 'completed') {
    changes.completedAt = null;
  }

  const assignment = await assignmentsStore.update(req.userId, req.params.id, changes);
  return res.json({ assignment });
}

export async function deleteAssignment(req, res) {
  const removed = await assignmentsStore.remove(req.userId, req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Assignment not found.' });
  }
  return res.status(204).end();
}