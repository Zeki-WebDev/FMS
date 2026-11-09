const path = require('path');
const express = require('express');
const cors = require('cors');
const requireAuth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Public values the browser needs to sign users in (anon key is safe to expose).
app.get('/api/config', (req, res) => {
  res.json({ url: process.env.SUPABASE_URL, anonKey: process.env.SUPABASE_ANON_KEY });
});

// Add new resources here: app.use('/api/products', requireAuth, require('./routes/products'));
app.use('/api/orders', requireAuth, require('./routes/orders'));

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

module.exports = app;
