import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Minimal, dependency-free persistence layer for user accounts.
// Stores users as a JSON file under backend/data/ so authentication is real
// (bcrypt-hashed passwords, unique ids) without requiring a database process.
// A future phase can swap this store for MongoDB without touching the API layer.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readUsers() {
  await ensureFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await ensureFile();
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(users, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

export async function findUserByEmail(email) {
  const users = await readUsers();
  const normalized = (email || '').trim().toLowerCase();
  return users.find((user) => user.email === normalized) || null;
}

export async function findUserById(id) {
  const users = await readUsers();
  return users.find((user) => user.id === id) || null;
}

export async function insertUser({ name, email, passwordHash }) {
  const users = await readUsers();
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeUsers(users);
  return user;
}

// Strips the password hash before returning a user to the client.
export function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}