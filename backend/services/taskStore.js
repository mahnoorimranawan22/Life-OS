import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Persistence layer for tasks. Documents mirror the planned MongoDB shape
// (user, title, description, status, priority, category, dueDate, completedAt,
// createdAt, updatedAt) so a later phase can swap this store for a database
// without touching the API layer. Every task is scoped to its owning user.

export const TASK_STATUSES = ['todo', 'in-progress', 'completed'];
export const TASK_PRIORITIES = ['low', 'medium', 'high'];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readTasks() {
  await ensureFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeTasks(tasks) {
  await ensureFile();
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(tasks, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

export async function listTasks(userId) {
  const tasks = await readTasks();
  return tasks.filter((task) => task.user === userId);
}

export async function findTaskById(userId, id) {
  const tasks = await readTasks();
  return tasks.find((task) => task.user === userId && task.id === id) || null;
}

export async function insertTask(data) {
  const tasks = await readTasks();
  const now = new Date().toISOString();
  const task = {
    id: crypto.randomUUID(),
    user: data.user,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    category: data.category,
    dueDate: data.dueDate,
    completedAt: data.completedAt,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  await writeTasks(tasks);
  return task;
}

export async function updateTaskById(userId, id, changes) {
  const tasks = await readTasks();
  const index = tasks.findIndex((task) => task.user === userId && task.id === id);
  if (index === -1) return null;
  tasks[index] = {
    ...tasks[index],
    ...changes,
    updatedAt: new Date().toISOString(),
  };
  await writeTasks(tasks);
  return tasks[index];
}

export async function deleteTaskById(userId, id) {
  const tasks = await readTasks();
  const next = tasks.filter((task) => !(task.user === userId && task.id === id));
  if (next.length === tasks.length) return false;
  await writeTasks(next);
  return true;
}