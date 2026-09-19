import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  deleteTaskById,
  findTaskById,
  insertTask,
  listTasks,
  updateTaskById,
} from '../services/taskStore.js';

const TITLE_MAX = 160;
const DESCRIPTION_MAX = 2000;
const CATEGORY_MAX = 80;

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

export async function createTask(req, res) {
  const { title, description, status, priority, category, dueDate } = req.body || {};

  const cleanTitle = cleanText(title, TITLE_MAX);
  if (!cleanTitle) {
    return res.status(400).json({ error: 'Please enter a task title.' });
  }

  let cleanStatus = 'todo';
  if (status !== undefined) {
    if (!TASK_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status must be todo, in-progress or completed.' });
    }
    cleanStatus = status;
  }

  let cleanPriority = 'medium';
  if (priority !== undefined) {
    if (!TASK_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: 'Priority must be low, medium or high.' });
    }
    cleanPriority = priority;
  }

  const cleanCategory = cleanText(category, CATEGORY_MAX);
  const cleanDescription = cleanText(description, DESCRIPTION_MAX);
  const cleanDue = parseIsoDate(dueDate);

  if (dueDate !== undefined && dueDate !== null && dueDate !== '' && !cleanDue) {
    return res.status(400).json({ error: 'Please enter a valid due date.' });
  }

  const task = await insertTask({
    user: req.userId,
    title: cleanTitle,
    description: cleanDescription || null,
    status: cleanStatus,
    priority: cleanPriority,
    category: cleanCategory || null,
    dueDate: cleanDue,
    completedAt: cleanStatus === 'completed' ? new Date().toISOString() : null,
  });

  return res.status(201).json({ task });
}

export async function getTasks(req, res) {
  let tasks = await listTasks(req.userId);

  const { search, status, priority, category, sort = 'dueDate', order = 'asc' } = req.query || {};

  if (search) {
    const query = String(search).trim().toLowerCase();
    if (query) {
      tasks = tasks.filter((task) =>
        [task.title, task.description, task.category]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }
  }
  if (TASK_STATUSES.includes(status)) {
    tasks = tasks.filter((task) => task.status === status);
  }
  if (TASK_PRIORITIES.includes(priority)) {
    tasks = tasks.filter((task) => task.priority === priority);
  }
  if (category) {
    const wanted = String(category).trim().toLowerCase();
    tasks = tasks.filter((task) => task.category && task.category.toLowerCase() === wanted);
  }

  const direction = order === 'desc' ? -1 : 1;
  const keyFor = {
    dueDate: (task) => task.dueDate ? new Date(task.dueDate).getTime() : Infinity,
    createdAt: (task) => new Date(task.createdAt).getTime(),
    priority: (task) => TASK_PRIORITIES.indexOf(task.priority),
    title: (task) => task.title.toLowerCase(),
  };
  const key = keyFor[sort] || keyFor.dueDate;

  // Completed tasks always sink to the bottom of the default view.
  tasks.sort((a, b) => {
    const aDone = a.status === 'completed' ? 1 : 0;
    const bDone = b.status === 'completed' ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    const aKey = key(a);
    const bKey = key(b);
    if (aKey < bKey) return -1 * direction;
    if (aKey > bKey) return 1 * direction;
    return 0;
  });

  return res.json({ tasks });
}

export async function getTask(req, res) {
  const task = await findTaskById(req.userId, req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  return res.json({ task });
}

export async function updateTask(req, res) {
  const existing = await findTaskById(req.userId, req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const { title, description, status, priority, category, dueDate } = req.body || {};

  const changes = {};

  if (title !== undefined) {
    const cleanTitle = cleanText(title, TITLE_MAX);
    if (!cleanTitle) {
      return res.status(400).json({ error: 'Please enter a task title.' });
    }
    changes.title = cleanTitle;
  }

  if (description !== undefined) {
    const cleanDescription = cleanText(description, DESCRIPTION_MAX);
    changes.description = cleanDescription || null;
  }

  if (status !== undefined) {
    if (!TASK_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status must be todo, in-progress or completed.' });
    }
    changes.status = status;
  }

  if (priority !== undefined) {
    if (!TASK_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: 'Priority must be low, medium or high.' });
    }
    changes.priority = priority;
  }

  if (category !== undefined) {
    const cleanCategory = cleanText(category, CATEGORY_MAX);
    changes.category = cleanCategory || null;
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

  const task = await updateTaskById(req.userId, req.params.id, changes);
  return res.json({ task });
}

export async function deleteTask(req, res) {
  const removed = await deleteTaskById(req.userId, req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  return res.status(204).end();
}