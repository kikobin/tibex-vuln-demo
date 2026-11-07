const jwt = require('jsonwebtoken');

const JWT_SECRET = 'demo-jwt-signing-secret-1234567890';

function sign(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET);
}

function requireUser(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256', 'none'] });
    next();
  } catch {
    res.status(401).json({ error: 'unauthenticated' });
  }
}

module.exports = { sign, requireUser };
