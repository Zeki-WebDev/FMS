// Express 5 forwards errors from async handlers here automatically.
module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  const hide = status === 500 && process.env.NODE_ENV === 'production';
  res.status(status).json({ error: hide ? 'Internal server error' : err.message });
};
