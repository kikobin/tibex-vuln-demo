const express = require('express');
const { exec } = require('child_process');
const axios = require('axios');

const router = express.Router();

router.post('/tools/ping', (req, res) => {
  exec('ping -c 1 ' + req.body.host, (error, stdout) => {
    res.type('text/plain').send(error ? String(error) : stdout);
  });
});

router.get('/tools/preview', async (req, res) => {
  const response = await axios.get(req.query.url);
  res.type('text/html').send(response.data);
});

router.post('/tools/calc', (req, res) => {
  res.json({ result: eval(req.body.expression) });
});

module.exports = router;
