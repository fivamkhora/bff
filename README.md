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
- `GET /api/v1/auth/user/whoami` - retorna o usuario autenticado pelo token JWT
- `GET /api/v1/auth/user/:identifier` - busca usuario por ID numerico ou nome parcial com Bearer token
- `GET /api/v1/ia/health` - health check da API de IA
- `POST /api/v1/ia/assessments` - cria uma avaliacao escolar
- `GET /api/v1/ia/assessments` - lista avaliacoes salvas com filtros opcionais
- `POST /api/v1/ia/assessments/:assessmentId/revisions` - cria uma revisao da avaliacao
- `GET /api/v1/turma/health` - health check da API Turma
- `POST /api/v1/turma/classrooms` - cria uma turma
- `GET /api/v1/turma/classrooms` - lista turmas
- `GET /api/v1/turma/classrooms/:id/members` - lista turmas de um usuario vinculado
- `GET /api/v1/turma/classrooms/:id` - lista membros de uma turma
- `POST /api/v1/turma/classrooms/:id/teachers` - vincula professor a turma
- `POST /api/v1/turma/classrooms/:id/students` - vincula aluno a turma

### Regra de negocio da API IA

- `POST /api/v1/ia/assessments` cria uma avaliacao a partir do material usado em aula e salva a versao inicial.
- A API IA persiste os dados originais em `assessments` e cada versao gerada ou revisada em `assessment_versions`.
- `GET /api/v1/ia/assessments` lista as avaliacoes salvas. Sem query params, retorna todas (`all`).
- A listagem aceita filtros opcionais: `subject`, `gradeLevel`, `classroomMaterial`, `assessmentType`, `assessmentId`, `questionCount`, `difficulty` e `teacherInstructions`.
- `assessmentId` nao e obrigatorio; use `GET /api/v1/ia/assessments?assessmentId=uuid` somente quando quiser buscar por identificador.
- `POST /api/v1/ia/assessments/:assessmentId/revisions` cria nova versao usando o material original, a avaliacao atual e o pedido de ajuste do professor.

### Regra de negocio da API Auth

- `POST /api/v1/auth/user` cria um registro em `user` e um registro em `person`, vinculando `person.user_id = user.id`.
- Campos obrigatorios no cadastro: `username`, `password`, `role`, `name` e `email`.
- Campos opcionais no cadastro: `cpf` e `birth`.
- `POST /api/v1/auth/user/signin` retorna `token` e `role`.
- O `role` retornado prioriza `person.role` quando houver pessoa vinculada; caso contrario usa `user.role`.
- `GET /api/v1/auth/user/whoami` usa o `sub` do JWT para retornar o usuario autenticado.
- `GET /api/v1/auth/user/:identifier` faz a consulta autenticada com Bearer token.
- Quando `identifier` e numerico, a busca e por `user.id`; quando e texto, a busca e por nome parcial em `person.name`.

## Docker

```bash
docker build -f docker/Dockerfile -t bff:local .
docker run --rm -p 3000:3000 --env-file .env bff:local
```
