const { Router } = require('express');

const { requireAuth } = require('../middlewares/auth');

const usersRouter = Router();

usersRouter.get('/me', requireAuth, (req, res) => {
  res.json({
    id: 'me',
    authenticated: true,
    tokenPreview: `${req.user.token.slice(0, 8)}...`
  });
});

module.exports = usersRouter;
