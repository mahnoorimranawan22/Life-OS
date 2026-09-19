import { parseDueDate } from './tasks.js';

export const ASSIGNMENT_STATUSES = ['todo', 'in-progress', 'completed'];
export const ASSIGNMENT_PRIORITIES = ['low', 'medium', 'high'];

export const ASSIGNMENT_STATUS_LABELS = {
  todo: 'To do',
  'in-progress': 'In progress',
  completed: 'Completed',
};

export const ASSIGNMENT_PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const ASSIGNMENT_STATUS_BADGE = {
  todo: 'neutral',
  'in-progress': 'accent',
  completed: 'success',
};

export const ASSIGNMENT_PRIORITY_BADGE = {
  low: 'outline',
  medium: 'soft',
  high: 'danger',
};

export const PLANNER_COLORS = [
  '#3e8e5a', // evergreen
  '#2e7d8f', // teal
  '#2f6fb3', // blue
  '#7a5bb8', // violet
  '#b0507a', // plum
  '#c14f3e', // terracotta
  '#c08a2d', // amber
  '#5b6770', // slate
];

export const DEFAULT_SUBJECT_COLOR = PLANNER_COLORS[0];

// "#3e8e5a" -> "rgba(62, 142, 90, 0.14)" for soft washes that stay in the
// warm, low-saturation visual language of the platform.
export function tintFor(hex) {
  const value = typeof hex === 'string' ? hex.trim() : '';
  const match = /^#?([0-9a-f]{6})$/i.exec(value);
  if (!match) return undefined;
  const parsed = parseInt(match[1], 16);
  return `rgba(${(parsed >> 16) & 255}, ${(parsed >> 8) & 255}, ${parsed & 255}, 0.14)`;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function dayDelta(iso) {
  const due = parseDueDate(iso);
  if (!due) return null;
  return Math.round((due.getTime() - startOfToday()) / MS_PER_DAY);
}

// Human-friendly "when" label for any date: Today / Tomorrow / weekday / date.
export function whenText(iso) {
  const days = dayDelta(iso);
  if (days === null) return null;
  const due = parseDueDate(iso);
  let text;
  if (days === 0) text = 'Today';
  else if (days === 1) text = 'Tomorrow';
  else if (days === -1) text = 'Yesterday';
  else if (Math.abs(days) <= 6) {
    text = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(due);
  } else {
    text = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(due);
  }
  return { text, days, overdue: days < 0, isToday: days === 0 };
}

export function formatFullDate(iso) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parseDueDate(iso));
}

export function assignmentProgress(assignments) {
  const total = assignments.length;
  if (total === 0) return null;
  const completed = assignments.filter((a) => a.status === 'completed').length;
  return { total, completed, percent: Math.round((completed / total) * 100) };
}

export function attendanceProgress(record) {
  if (!record) return null;
  const percent =
    record.totalClasses > 0
      ? Math.round((record.attendedClasses / record.totalClasses) * 100)
      : 0;
  return { ...record, percent };
}

export function semestersFor(subjects) {
  const set = new Set();
  subjects.forEach((subject) => set.add(subject.semester || 'No semester'));
  return Array.from(set).sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
}

// Upcoming academic deadlines across assignments and exams, merged by date.
export function upcomingDeadlines(assignments, exams, subjectById, limit) {
  const start = startOfToday();
  const rows = [
    ...assignments
      .filter((a) => a.status !== 'completed' && a.dueDate && dayDelta(a.dueDate) >= 0)
      .map((a) => ({
        id: a.id,
        kind: 'assignment',
        title: a.title,
        date: parseDueDate(a.dueDate).getTime(),
        dueText: whenText(a.dueDate).text,
        subject: a.subject,
        subjectName: subjectById.get(a.subject)?.name || null,
        subjectColor: subjectById.get(a.subject)?.color || null,
      })),
    ...exams
      .filter((e) => e.examDate && dayDelta(e.examDate) >= 0)
      .map((e) => ({
        id: e.id,
        kind: 'exam',
        title: e.title,
        date: parseDueDate(e.examDate).getTime(),
        dueText: whenText(e.examDate).text,
        subject: e.subject,
        subjectName: subjectById.get(e.subject)?.name || null,
        subjectColor: subjectById.get(e.subject)?.color || null,
      })),
  ];
  rows.sort((a, b) => a.date - b.date);
  const result = rows.slice(0, limit ?? rows.length);
  return { next: result[0] || null, rows: result };
}

// ---- GPA calculator (grades are entered by the user, not stored) ----
export const GRADE_POINTS = [
  { grade: 'A', points: 4.0 },
  { grade: 'A−', points: 3.7 },
  { grade: 'B+', points: 3.3 },
  { grade: 'B', points: 3.0 },
  { grade: 'B−', points: 2.7 },
  { grade: 'C+', points: 2.3 },
  { grade: 'C', points: 2.0 },
  { grade: 'C−', points: 1.7 },
  { grade: 'D+', points: 1.3 },
  { grade: 'D', points: 1.0 },
  { grade: 'F', points: 0 },
];

export const pointsForGrade = (grade) =>
  GRADE_POINTS.find((entry) => entry.grade === grade)?.points ?? 0;

export function computeGpa(entries) {
  const credits = entries.reduce((sum, entry) => sum + (Number(entry.credits) || 0), 0);
  const points = entries.reduce(
    (sum, entry) => sum + (Number(entry.credits) || 0) * (Number(entry.points) || 0),
    0
  );
  return { credits, points, gpa: credits > 0 ? points / credits : 0 };
}