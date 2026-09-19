// Central error handler — attached last in the Express middleware chain.
// Controllers can throw with an optional `status` to produce non-500 responses.
export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: err.message || 'Internal server error' });
}