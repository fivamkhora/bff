const env = require('../config/env');

const JSON_CONTENT_TYPE = 'application/json';

function buildApiIaUrl(path) {
  return new URL(path, env.apiIaBaseUrl).toString();
}

function buildApiIaUrlWithQuery(path, query) {
  const url = new URL(path, env.apiIaBaseUrl);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item));
      return;
    }

    if (value !== undefined) {
      url.searchParams.append(key, value);
    }
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

async function proxyApiIaRequest(req, res, next, options) {
  try {
    const url = options.forwardQuery
      ? buildApiIaUrlWithQuery(options.path, req.query)
      : buildApiIaUrl(options.path);

    const response = await fetch(url, {
      method: options.method,
      headers: buildForwardHeaders(req),
      body: options.method === 'GET' ? undefined : JSON.stringify(req.body ?? {})
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
    error.message = `Falha ao consultar API de IA: ${error.message}`;
    return next(error);
  }
}

module.exports = {
  proxyApiIaRequest
};
