export function notFound(err, _req, res, next) {
  if (err.status === 404) {
    return res.status(404).json({ error: err.message || "Not Found" });
  }
  next(err);
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
}
