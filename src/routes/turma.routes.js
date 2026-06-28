const { Router } = require('express');

const { proxyApiTurmaRequest } = require('../services/api-turma.service');

const turmaRouter = Router();

turmaRouter.get('/health', (req, res, next) => {
  proxyApiTurmaRequest(req, res, next, {
    method: 'GET',
    path: '/'
  });
});

turmaRouter.post('/classrooms', (req, res, next) => {
  proxyApiTurmaRequest(req, res, next, {
    method: 'POST',
    path: '/classrooms'
  });
});

turmaRouter.get('/classrooms', (req, res, next) => {
  proxyApiTurmaRequest(req, res, next, {
    method: 'GET',
    path: '/classrooms'
  });
});

module.exports = turmaRouter;
