import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), '..', 'data');
const FILE = (name) => path.join(DATA_DIR, `${name}.json`);

const KEEP_EMAILS = new Set([
  'ada@lifeos.test',
  'ada.dash@lifeos.test',
  'alice.tasks@lifeos.test',
  'bob.tasks@lifeos.test',
]);

async function readFile(name) {
  try {
    return JSON.parse(await fs.readFile(FILE(name), 'utf8'));
  } catch {
    return [];
  }
}

async function writeFile(name, docs) {
  await fs.writeFile(FILE(name), `${JSON.stringify(docs, null, 2)}\n`, 'utf8');
}

const users = await readFile('users');
const keptIds = new Set();
const removedUsers = [];
for (const user of users) {
  if (KEEP_EMAILS.has(user.email)) {
    keptIds.add(user.id);
  } else {
    removedUsers.push(`${user.email} (${user.id})`);
  }
}

// Any user id not in the kept set is a probe/test account.
const nextUsers = users.filter((user) => keptIds.has(user.id));
await writeFile('users', nextUsers);

// Keep tasks for everyone who stays, but drop the seeded API-test planner data
// (it was created while validating the planner endpoints, not by the user).
const aliceTasks = users.find((u) => u.email === 'alice.tasks@lifeos.test');
const purgePlannerUser = aliceTasks ? aliceTasks.id : null;

for (const name of ['tasks']) {
  const docs = await readFile(name);
  const next = docs.filter((doc) => keptIds.has(doc.user));
  await writeFile(name, next);
}

for (const name of ['subjects', 'assignments', 'exams', 'attendance']) {
  const docs = await readFile(name);
  const next = docs.filter(
    (doc) => keptIds.has(doc.user) && doc.user !== purgePlannerUser
  );
  await writeFile(name, next);
}

console.log(`Removed ${removedUsers.length} probe/test users:`);
for (const u of removedUsers) console.log(`  - ${u}`);
console.log(`Users remaining: ${nextUsers.length}`);
for (const name of ['tasks', 'subjects', 'assignments', 'exams', 'attendance']) {
  console.log(`${name}: ${(await readFile(name)).length}`);
}