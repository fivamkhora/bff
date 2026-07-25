const assert = require('node:assert/strict');
const http = require('node:http');
const { after, before, describe, it } = require('node:test');

let upstreamServer;
let bffServer;
let bffBaseUrl;

function listen(server) {
  return new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

describe('API Avaliacao proxy', () => {
  before(async () => {
    upstreamServer = http.createServer((req, res) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => {
        res.writeHead(req.method === 'POST' ? 201 : 200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({
          method: req.method,
          url: req.url,
          authorization: req.headers.authorization,
          body: chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : null
        }));
      });
    });
    await listen(upstreamServer);

    const upstreamAddress = upstreamServer.address();
    process.env.API_AVALIACAO_BASE_URL = `http://127.0.0.1:${upstreamAddress.port}`;
    process.env.NODE_ENV = 'test';

    const app = require('../src/app');
    bffServer = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => bffServer.once('listening', resolve));
    const bffAddress = bffServer.address();
    bffBaseUrl = `http://127.0.0.1:${bffAddress.port}`;
  });

  after(async () => {
    await close(bffServer);
    await close(upstreamServer);
  });

  it('encaminha filtros e autorizacao nas consultas', async () => {
    const response = await fetch(`${bffBaseUrl}/api/v1/avaliacao/exams?classroomId=turma-01&status=PUBLISHED`, {
      headers: { authorization: 'Bearer token-de-teste' }
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.method, 'GET');
    assert.equal(body.url, '/exams?classroomId=turma-01&status=PUBLISHED');
    assert.equal(body.authorization, 'Bearer token-de-teste');
  });

  it('encaminha corpo JSON e preserva o status da API', async () => {
    const payload = { examId: 'exam-01', studentId: 'student-01' };
    const response = await fetch(`${bffBaseUrl}/api/v1/avaliacao/submissions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.method, 'POST');
    assert.deepEqual(body.body, payload);
  });

  it('encaminha a importacao de uma avaliacao da API-IA', async () => {
    const payload = { classroomId: 'turma-01', teacherId: 'professor-01' };
    const response = await fetch(
      `${bffBaseUrl}/api/v1/avaliacao/exams/import/api-ia/assessment-01`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.url, '/exams/import/api-ia/assessment-01');
    assert.deepEqual(body.body, payload);
  });

  it('codifica o identificador ao montar a rota de detalhe', async () => {
    const response = await fetch(`${bffBaseUrl}/api/v1/avaliacao/answers/resposta%2F01`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.url, '/answers/resposta%2F01');
  });
});
