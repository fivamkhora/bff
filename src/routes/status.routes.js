const { Router } = require('express');

const env = require('../config/env');

const statusRouter = Router();

statusRouter.get('/', (_req, res) => {
  res.json({
    service: 'bff',
    environment: env.nodeEnv,
    version: env.apiVersion,
    node: process.version
  });
});

module.exports = statusRouter;
