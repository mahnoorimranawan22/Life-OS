import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt.js';

export const SESSION_COOKIE = 'lifeos_session';

export function validateToken(token) {
  return jwt.verify(token, jwtSecret);
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.[SESSION_COOKIE];

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const payload = validateToken(token);
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}