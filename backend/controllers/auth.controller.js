import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt.js';
import { SESSION_COOKIE } from '../middleware/auth.middleware.js';
import { findUserByEmail, findUserById, insertUser, publicUser } from '../services/userStore.js';

const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}

function setSessionCookie(res, userId) {
  const token = jwt.sign({ sub: userId }, jwtSecret, { expiresIn: '7d' });
  res.cookie(SESSION_COOKIE, token, { ...sessionCookieOptions(), maxAge: SESSION_MAX_AGE });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions());
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(req, res) {
  const { name, email, password } = req.body || {};

  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanPassword = typeof password === 'string' ? password : '';

  if (!cleanName || cleanName.length > 60) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (cleanPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  if (await findUserByEmail(cleanEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(cleanPassword, 10);
  const user = await insertUser({ name: cleanName, email: cleanEmail, passwordHash });

  setSessionCookie(res, user.id);
  return res.status(201).json({ user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body || {};

  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanPassword = typeof password === 'string' ? password : '';

  const user = await findUserByEmail(cleanEmail);
  const passwordOk = user ? await bcrypt.compare(cleanPassword, user.passwordHash) : false;

  if (!user || !passwordOk) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  setSessionCookie(res, user.id);
  return res.json({ user: publicUser(user) });
}

export function logout(_req, res) {
  clearSessionCookie(res);
  return res.status(204).end();
}

export async function me(req, res) {
  const user = await findUserById(req.userId);

  if (!user) {
    return res.status(401).json({ error: 'Account no longer exists.' });
  }

  return res.json({ user: publicUser(user) });
}