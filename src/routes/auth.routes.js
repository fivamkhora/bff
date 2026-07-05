const { Router } = require('express');

const { proxyApiAuthRequest } = require('../services/api-auth.service');

const authRouter = Router();

authRouter.post('/user', (req, res, next) => {
  proxyApiAuthRequest(req, res, next, {
    method: 'POST',
    path: '/user'
  });
});

authRouter.post('/user/signin', (req, res, next) => {
  proxyApiAuthRequest(req, res, next, {
    method: 'POST',
    path: '/user/signin'
  });
});

authRouter.get('/user/whoami', (req, res, next) => {
  proxyApiAuthRequest(req, res, next, {
    method: 'GET',
    path: '/user/whoami'
  });
});

authRouter.get('/user/:identifier', (req, res, next) => {
  proxyApiAuthRequest(req, res, next, {
    method: 'GET',
    path: `/user/${encodeURIComponent(req.params.identifier)}`
  });
});

module.exports = authRouter;
