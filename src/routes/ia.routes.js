const { Router } = require('express');

const { proxyApiIaRequest } = require('../services/api-ia.service');

const iaRouter = Router();

iaRouter.get('/health', (req, res, next) => {
  proxyApiIaRequest(req, res, next, {
    method: 'GET',
    path: '/api/v1/health'
  });
});

iaRouter.post('/assessments', (req, res, next) => {
  proxyApiIaRequest(req, res, next, {
    method: 'POST',
    path: '/api/v1/assessments'
  });
});

iaRouter.get('/assessments', (req, res, next) => {
  proxyApiIaRequest(req, res, next, {
    method: 'GET',
    path: '/api/v1/assessments',
    forwardQuery: true
  });
});

iaRouter.post('/assessments/:assessmentId/revisions', (req, res, next) => {
  proxyApiIaRequest(req, res, next, {
    method: 'POST',
    path: `/api/v1/assessments/${encodeURIComponent(req.params.assessmentId)}/revisions`
  });
});

module.exports = iaRouter;
