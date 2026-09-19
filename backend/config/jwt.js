import crypto from 'node:crypto';
import env from './env.js';

// Resolves the JWT signing secret.
// - Production requires JWT_SECRET (fails fast if it is missing).
// - Development generates an ephemeral secret so the API works out of the box;
//   sessions reset whenever the server restarts, which is clearly logged.
if (env.nodeEnv === 'production' && !env.jwtSecret) {
  throw new Error('JWT_SECRET is required when NODE_ENV=production.');
}

if (env.nodeEnv !== 'production' && !env.jwtSecret) {
  console.warn('JWT_SECRET is not set — using an ephemeral development secret. Sessions reset on restart.');
}

export const jwtSecret = env.jwtSecret || crypto.randomBytes(32).toString('hex');