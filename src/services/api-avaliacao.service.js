const env = require('../config/env');

const JSON_CONTENT_TYPE = 'application/json';

function buildApiAvaliacaoUrl(path, query) {
  const url = new URL(path, env.apiAvaliacaoBaseUrl);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((item) => {
      if (item !== undefined) {
        url.searchParams.append(key, item);
      }
    });
  });

  return url.toString();
}

function buildForwardHeaders(req) {
  const headers = {
    accept: JSON_CONTENT_TYPE,
    origin: env.bffPublicUrl,
    referer: `${env.bffPublicUrl}/`,
    'x-forwarded-host': req.get('host'),
    'x-forwarded-proto': req.protocol
  };

  const authorization = req.get('authorization');
  if (authorization) {
    headers.authorization = authorization;
  }

  if (req.body && Object.keys(req.body).length > 0) {
    headers['content-type'] = JSON_CONTENT_TYPE;
  }

  return headers;
}

async function proxyApiAvaliacaoRequest(req, res, next, options) {
  try {
    const url = buildApiAvaliacaoUrl(options.path, options.forwardQuery ? req.query : undefined);
    const hasBody = !['GET', 'HEAD'].includes(options.method)
      && req.body
      && Object.keys(req.body).length > 0;
    const response = await fetch(url, {
      method: options.method,
      headers: buildForwardHeaders(req),
      body: hasBody ? JSON.stringify(req.body) : undefined
    });

    if (response.status === 204) {
      return res.status(204).send();
    }

    const contentType = response.headers.get('content-type') ?? '';
    const payload = contentType.includes(JSON_CONTENT_TYPE)
      ? await response.json()
      : await response.text();

    res.status(response.status);
    if (contentType) {
      res.type(contentType);
    }

    return typeof payload === 'string' ? res.send(payload) : res.json(payload);
  } catch (error) {
    error.statusCode = 502;
    error.message = `Falha ao consultar API Avaliacao: ${error.message}`;
    return next(error);
  }
}

module.exports = {
  proxyApiAvaliacaoRequest
};
