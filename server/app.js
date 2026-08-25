require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const webhooksRouter = require('./routes/webhooks');

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/webhooks', webhooksRouter);

// ─── Serve React static build (production) ───────────────────────────────────
const distPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`WebHookFire server running on http://localhost:${PORT}`);
});

module.exports = app;
