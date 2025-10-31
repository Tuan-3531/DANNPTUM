const jwt = require('jsonwebtoken');
const JWT_SECRET = "Tuandeptraibodoiqua";

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Không có token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Không có quyền' });
  next();
}

module.exports = { authenticateToken, isAdmin };
