const { Router } = require('express');

const { proxyApiAvaliacaoRequest } = require('../services/api-avaliacao.service');

const avaliacaoRouter = Router();

function proxy(method, path, forwardQuery = false) {
  return (req, res, next) => proxyApiAvaliacaoRequest(req, res, next, {
    method,
    path: typeof path === 'function' ? path(req) : path,
    forwardQuery
  });
}

avaliacaoRouter.get('/health', proxy('GET', '/healthcheck'));

avaliacaoRouter.get('/exams', proxy('GET', '/exams', true));
avaliacaoRouter.post('/exams', proxy('POST', '/exams'));
avaliacaoRouter.get('/exams/upcoming', proxy('GET', '/exams/upcoming', true));
avaliacaoRouter.post(
  '/exams/import/api-ia/:assessmentId',
  proxy('POST', (req) => `/exams/import/api-ia/${encodeURIComponent(req.params.assessmentId)}`)
);
avaliacaoRouter.get('/exams/:id', proxy('GET', (req) => `/exams/${encodeURIComponent(req.params.id)}`));
avaliacaoRouter.put('/exams/:id', proxy('PUT', (req) => `/exams/${encodeURIComponent(req.params.id)}`));
avaliacaoRouter.delete('/exams/:id', proxy('DELETE', (req) => `/exams/${encodeURIComponent(req.params.id)}`));

for (const resource of ['questions', 'submissions', 'answers']) {
  avaliacaoRouter.get(`/${resource}`, proxy('GET', `/${resource}`, true));
  avaliacaoRouter.post(`/${resource}`, proxy('POST', `/${resource}`));
  avaliacaoRouter.get(`/${resource}/:id`, proxy('GET', (req) => `/${resource}/${encodeURIComponent(req.params.id)}`));
  avaliacaoRouter.put(`/${resource}/:id`, proxy('PUT', (req) => `/${resource}/${encodeURIComponent(req.params.id)}`));
  avaliacaoRouter.delete(`/${resource}/:id`, proxy('DELETE', (req) => `/${resource}/${encodeURIComponent(req.params.id)}`));
}

module.exports = avaliacaoRouter;
