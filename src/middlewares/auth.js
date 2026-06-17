function requireAuth(req, res, next) {
  const authorization = req.header('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token Bearer nao informado' });
  }

  req.user = {
    token: authorization.replace('Bearer ', '')
  };

  return next();
}

module.exports = {
  requireAuth
};
