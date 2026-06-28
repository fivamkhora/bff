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
API_AUTH_BASE_URL=https://api-auth-khora.onrender.com
API_IA_BASE_URL=https://api-ia-khora.onrender.com
API_TURMA_BASE_URL=https://api-turma-khora.onrender.com
BFF_PUBLIC_URL=https://bff-khora.onrender.com
```

## Rotas iniciais

- `GET /` - metadados da API
- `GET /api/v1/health` - health check
- `GET /api/v1/status` - status do BFF
- `GET /api/v1/users/me` - exemplo de rota protegida por Bearer token
- `POST /api/v1/auth/user` - cria um usuario
- `POST /api/v1/auth/user/signin` - autentica usuario e retorna JWT
- `GET /api/v1/auth/user/:id` - busca usuario por ID com Bearer token
- `GET /api/v1/ia/health` - health check da API de IA
- `POST /api/v1/ia/assessments` - cria uma avaliacao escolar
- `GET /api/v1/ia/assessments/:assessmentId` - busca uma avaliacao salva
- `POST /api/v1/ia/assessments/:assessmentId/revisions` - cria uma revisao da avaliacao
- `GET /api/v1/turma/health` - health check da API Turma
- `POST /api/v1/turma/classrooms` - cria uma turma
- `GET /api/v1/turma/classrooms` - lista turmas

### Regra de negocio da API Auth

- `POST /api/v1/auth/user` aceita `person` opcional com `cpf`, `name`, `birth` e `email`.
- Quando `person` e informado, a API Auth cria o registro complementar e vincula em `person.user_id = user.id`.
- `POST /api/v1/auth/user/signin` retorna `token`, `role` e `user`.
- O `role` retornado prioriza `person.role` quando houver pessoa vinculada; caso contrario usa `user.role`.
- `GET /api/v1/auth/user/:id` faz a consulta autenticada com Bearer token.

## Docker

```bash
docker build -f docker/Dockerfile -t bff:local .
docker run --rm -p 3000:3000 --env-file .env bff:local
```
