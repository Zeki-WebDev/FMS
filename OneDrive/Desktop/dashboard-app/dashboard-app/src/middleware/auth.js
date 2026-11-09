const supabase = require('../config/supabase');

// Verifies the Supabase access token sent by the browser.
module.exports = async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Sign in required' });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Session expired. Sign in again.' });

  req.user = data.user;
  next();
};
