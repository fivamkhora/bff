# BFF API

Backend For Frontend em Node.js com Express, documentação Swagger/OpenAPI,
testes automatizados, Docker e CI/CD via GitHub Actions.

## Requisitos

- Node.js 22.x
- npm

## Como rodar localmente

```bash
npm install
npm run dev
```

A API fica disponível em:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`

## Scripts

```bash
npm start      # inicia em modo producao
npm run dev    # inicia com --watch
npm test       # roda testes nativos do Node.js
```

## Variaveis de ambiente

Copie `.env.example` para `.env` e ajuste conforme o ambiente.

```bash
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
API_VERSION=1.0.0
```

## Rotas iniciais

- `GET /` - metadados da API
- `GET /api/v1/health` - health check
- `GET /api/v1/status` - status do BFF
- `GET /api/v1/users/me` - exemplo de rota protegida por Bearer token

## Docker

```bash
docker build -f docker/Dockerfile -t bff:local .
docker run --rm -p 3000:3000 --env-file .env bff:local
```
