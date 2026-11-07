const express = require('express');
const config = require('./config');
const db = require('./db');
const { sign } = require('./auth');

const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  const user = db.prepare('select id, role from users where email = ?').get(req.body.email);
  if (!user) return res.status(401).json({ error: 'unknown user' });
  res.json({ token: sign(user) });
});

app.use(require('./users'));
app.use(require('./files'));
app.use(require('./tools'));

app.listen(config.port, () => {
  process.stdout.write(`api on ${config.port}\n`);
});
