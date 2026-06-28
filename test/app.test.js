const assert = require('node:assert/strict');
const { after, before, describe, it } = require('node:test');

const app = require('../src/app');

let server;
let baseUrl;

describe('BFF API', () => {
  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('returns health status', async () => {
    const response = await fetch(`${baseUrl}/api/v1/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
    assert.ok(body.timestamp);
  });

  it('serves swagger json', async () => {
    const response = await fetch(`${baseUrl}/docs.json`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.openapi, '3.0.3');
    assert.ok(body.paths['/api/v1/health']);
    assert.ok(body.paths['/api/v1/ia/assessments']);
    assert.ok(body.paths['/api/v1/ia/assessments/{assessmentId}/revisions']);
    assert.ok(body.paths['/api/v1/turma/health']);
    assert.ok(body.paths['/api/v1/turma/classrooms']);
  });

  it('protects the authenticated user route', async () => {
    const response = await fetch(`${baseUrl}/api/v1/users/me`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error, 'Token Bearer nao informado');
  });
});
