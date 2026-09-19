export const TASK_STATUSES = ['todo', 'in-progress', 'completed'];
export const TASK_PRIORITIES = ['low', 'medium', 'high'];

export const STATUS_LABELS = {
  todo: 'To do',
  'in-progress': 'In progress',
  completed: 'Completed',
};

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const STATUS_BADGE = {
  todo: 'neutral',
  'in-progress': 'accent',
  completed: 'success',
};

export const PRIORITY_BADGE = {
  low: 'outline',
  medium: 'soft',
  high: 'danger',
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Parses an ISO timestamp as the calendar date it was created from, in local
// time, so due dates never drift across timezones.
export function parseDueDate(iso) {
  if (!iso) return null;
  const parts = String(iso).split('T')[0].split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export function isOverdue(task) {
  if (!task.dueDate || task.status === 'completed') return false;
  return parseDueDate(task.dueDate).getTime() < startOfToday();
}

export function isDueToday(task) {
  if (!task.dueDate) return false;
  return parseDueDate(task.dueDate).getTime() === startOfToday();
}

export function dueLabel(task) {
  const due = parseDueDate(task.dueDate);
  if (!due) return null;

  const deltaDays = Math.round((due.getTime() - startOfToday()) / MS_PER_DAY);

  let text;
  if (deltaDays === 0) text = 'Today';
  else if (deltaDays === 1) text = 'Tomorrow';
  else if (deltaDays === -1) text = 'Yesterday';
  else if (Math.abs(deltaDays) <= 6) {
    text = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(due);
  } else {
    text = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(due);
  }

  return { text, overdue: isOverdue(task), isToday: deltaDays === 0 };
}

export function comparatorFor(kind = 'dueDate', direction = 'asc') {
  const keys = {
    dueDate: (task) => (task.dueDate ? parseDueDate(task.dueDate).getTime() : Infinity),
    title: (task) => (task.title || '').toLowerCase(),
    priority: (task) => TASK_PRIORITIES.indexOf(task.priority),
    createdAt: (task) => new Date(task.createdAt).getTime(),
  };
  const key = keys[kind] || keys.dueDate;
  const sign = direction === 'desc' ? -1 : 1;

  return (a, b) => {
    const aDone = a.status === 'completed' ? 1 : 0;
    const bDone = b.status === 'completed' ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    const aKey = key(a);
    const bKey = key(b);
    if (aKey < bKey) return -1 * sign;
    if (aKey > bKey) return 1 * sign;
    return 0;
  };
}