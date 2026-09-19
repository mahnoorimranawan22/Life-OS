export function getHealth(_req, res) {
  res.json({
    status: 'ok',
    service: 'lifeos-api',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}