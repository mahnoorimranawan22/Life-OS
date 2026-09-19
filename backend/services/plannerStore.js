import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Persistence layer for the university planner. Each collection mirrors a
// planned MongoDB collection (subjects, assignments, exams, attendance) and
// every document is scoped to its owning user, so a later phase can swap this
// store for a database without touching the API layer.

export const ASSIGNMENT_STATUSES = ['todo', 'in-progress', 'completed'];
export const ASSIGNMENT_PRIORITIES = ['low', 'medium', 'high'];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

const COLLECTIONS = {
  subjects: 'subjects.json',
  assignments: 'assignments.json',
  exams: 'exams.json',
  attendance: 'attendance.json',
};

async function ensureFile(file) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, '[]', 'utf8');
  }
}

async function readAll(file) {
  await ensureFile(file);
  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(file, docs) {
  await ensureFile(file);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(docs, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

function makeCollection(name) {
  const file = path.join(DATA_DIR, COLLECTIONS[name]);
  return {
    async list(userId) {
      const docs = await readAll(file);
      return docs.filter((doc) => doc.user === userId);
    },
    async find(userId, id) {
      const docs = await readAll(file);
      return docs.find((doc) => doc.user === userId && doc.id === id) || null;
    },
    async insert(data) {
      const docs = await readAll(file);
      const now = new Date().toISOString();
      const doc = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      docs.push(doc);
      await writeAll(file, docs);
      return doc;
    },
    async update(userId, id, changes) {
      const docs = await readAll(file);
      const index = docs.findIndex((doc) => doc.user === userId && doc.id === id);
      if (index === -1) return null;
      docs[index] = {
        ...docs[index],
        ...changes,
        updatedAt: new Date().toISOString(),
      };
      await writeAll(file, docs);
      return docs[index];
    },
    async remove(userId, id) {
      const docs = await readAll(file);
      const next = docs.filter((doc) => !(doc.user === userId && doc.id === id));
      if (next.length === docs.length) return false;
      await writeAll(file, next);
      return true;
    },
    async removeWhere(userId, predicate) {
      const docs = await readAll(file);
      const next = docs.filter((doc) => !(doc.user === userId && predicate(doc)));
      if (next.length === docs.length) return;
      await writeAll(file, next);
    },
  };
}

export const subjectsStore = makeCollection('subjects');
export const assignmentsStore = makeCollection('assignments');
export const examsStore = makeCollection('exams');
export const attendanceStore = makeCollection('attendance');

export async function removePlannerDataForUser(userId) {
  for (const name of Object.keys(COLLECTIONS)) {
    const file = path.join(DATA_DIR, COLLECTIONS[name]);
    const docs = await readAll(file);
    const next = docs.filter((doc) => doc.user !== userId);
    await writeAll(file, next);
  }
}