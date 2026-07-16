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

turmaRouter.get('/classrooms/:id/members', (req, res, next) => {
  proxyApiTurmaRequest(req, res, next, {
    method: 'GET',
    path: `/classrooms/${encodeURIComponent(req.params.id)}/members`
  });
});

turmaRouter.get('/classrooms/:id/classrooms', (req, res, next) => {
  proxyApiTurmaRequest(req, res, next, {
    method: 'GET',
    path: `/classrooms/${encodeURIComponent(req.params.id)}/classrooms`
  });
});

turmaRouter.get('/classrooms/:id', (req, res, next) => {
  proxyApiTurmaRequest(req, res, next, {
    method: 'GET',
    path: `/classrooms/${encodeURIComponent(req.params.id)}`
  });
});

turmaRouter.post('/classrooms/:id/teachers', (req, res, next) => {
  proxyApiTurmaRequest(req, res, next, {
    method: 'POST',
    path: `/classrooms/${encodeURIComponent(req.params.id)}/teachers`
  });
});

turmaRouter.delete('/classrooms/:id/teachers', (req, res, next) => {
  proxyApiTurmaRequest(req, res, next, {
    method: 'DELETE',
    path: `/classrooms/${encodeURIComponent(req.params.id)}/teachers`
  });
});

turmaRouter.post('/classrooms/:id/students', (req, res, next) => {
  proxyApiTurmaRequest(req, res, next, {
    method: 'POST',
    path: `/classrooms/${encodeURIComponent(req.params.id)}/students`
  });
});

turmaRouter.delete('/classrooms/:id/students', (req, res, next) => {
  proxyApiTurmaRequest(req, res, next, {
    method: 'DELETE',
    path: `/classrooms/${encodeURIComponent(req.params.id)}/students`
  });
});

module.exports = turmaRouter;
