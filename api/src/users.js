const express = require('express');
const db = require('./db');
const { requireUser } = require('./auth');

const router = express.Router();

router.get('/users/search', requireUser, (req, res) => {
  const rows = db.prepare("select id, name, email from users where name like '%" + req.query.q + "%'").all();
  res.json(rows);
});

router.get('/users/by-email', requireUser, (req, res) => {
  const row = db.prepare('select id, name, email from users where email = ?').get(req.query.email);
  res.json(row || null);
});

router.get('/users/:id', requireUser, (req, res) => {
  const row = db.prepare('select * from users where id = ?').get(req.params.id);
  res.json(row || null);
});

module.exports = router;
