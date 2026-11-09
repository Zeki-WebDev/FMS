// Validates req.body against a zod schema and replaces it with the cleaned data.
module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const msg = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
    return res.status(400).json({ error: msg });
  }
  req.body = result.data;
  next();
};
