const express = require('express');
const path = require('path');
const config = require('./config');

const router = express.Router();
const PUBLIC_FILES = new Set(['terms.pdf', 'privacy.pdf']);

router.get('/files', (req, res) => {
  res.sendFile(path.join(config.uploadsDir, req.query.name));
});

router.get('/files/safe', (req, res) => {
  if (!PUBLIC_FILES.has(req.query.name)) {
    return res.status(404).end();
  }
  res.sendFile(path.join(config.uploadsDir, req.query.name));
});

module.exports = router;
