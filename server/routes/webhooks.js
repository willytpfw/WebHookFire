const express = require('express');
const axios = require('axios');
const db = require('../db/database');
const { webhookRules, idRule, handleValidation } = require('../middleware/validate');

const router = express.Router();

// ─── GET all webhooks ─────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM WebHook ORDER BY Id ASC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET single webhook ───────────────────────────────────────────────────────
router.get('/:id', idRule, handleValidation, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM WebHook WHERE Id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'webhooks.error.notFound' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST create webhook ──────────────────────────────────────────────────────
router.post('/', webhookRules, handleValidation, (req, res) => {
  const { Name, Description = '', URL } = req.body;
  try {
    const stmt = db.prepare(
      'INSERT INTO WebHook (Name, Description, URL) VALUES (?, ?, ?)'
    );
    const info = stmt.run(Name.trim(), Description.trim(), URL.trim());
    const created = db.prepare('SELECT * FROM WebHook WHERE Id = ?').get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'webhooks.error.nameTaken' });
    }
    if (err.message.includes('CHECK constraint')) {
      return res.status(422).json({ error: 'webhooks.error.checkConstraint' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT update webhook ───────────────────────────────────────────────────────
router.put('/:id', idRule, webhookRules, handleValidation, (req, res) => {
  const { Name, Description = '', URL } = req.body;
  const { id } = req.params;
  try {
    const existing = db.prepare('SELECT * FROM WebHook WHERE Id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'webhooks.error.notFound' });

    db.prepare(
      'UPDATE WebHook SET Name = ?, Description = ?, URL = ? WHERE Id = ?'
    ).run(Name.trim(), Description.trim(), URL.trim(), id);

    const updated = db.prepare('SELECT * FROM WebHook WHERE Id = ?').get(id);
    res.json(updated);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'webhooks.error.nameTaken' });
    }
    if (err.message.includes('CHECK constraint')) {
      return res.status(422).json({ error: 'webhooks.error.checkConstraint' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE webhook ───────────────────────────────────────────────────────────
router.delete('/:id', idRule, handleValidation, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM WebHook WHERE Id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'webhooks.error.notFound' });

    db.prepare('DELETE FROM WebHook WHERE Id = ?').run(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST fire webhook ────────────────────────────────────────────────────────
router.post('/:id/fire', idRule, handleValidation, async (req, res) => {
  try {
    const webhook = db.prepare('SELECT * FROM WebHook WHERE Id = ?').get(req.params.id);
    if (!webhook) return res.status(404).json({ error: 'webhooks.error.notFound' });

    const response = await axios.post(webhook.URL, {}, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true, // Don't throw on any HTTP status
    });

    res.json({
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.code === 'ERR_CANCELED') {
      return res.status(504).json({ error: 'webhooks.error.timeout' });
    }
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      return res.status(502).json({ error: 'webhooks.error.unreachable' });
    }
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
