# BFF API

Backend For Frontend em Node.js com Express para centralizar o consumo das APIs do ecossistema Khora/FIVAM.

O BFF expoe documentacao Swagger/OpenAPI, repassa chamadas para os microsservicos e padroniza o ponto de entrada do frontend.

## Requisitos

- Node.js 22.x
- npm

## Aplicacoes Integradas

- API Auth: `https://api-auth-khora.onrender.com`
- API IA: `https://api-ia-khora.onrender.com`
- API Turma: `https://api-turma-khora.onrender.com`
- API Avaliacao: `https://api-avaliacao-khora.onrender.com`

## Como Rodar Localmente

```bash
npm install
npm run dev
```

URLs locais:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`

## Scripts

```bash
npm start      # inicia em modo producao
npm run dev    # inicia com --watch
npm test       # roda testes nativos do Node.js
```

## Variaveis De Ambiente

Copie `.env.example` para `.env` e ajuste conforme o ambiente.

```bash
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
API_VERSION=1.0.0
API_AUTH_BASE_URL=https://api-auth-khora.onrender.com
API_IA_BASE_URL=https://api-ia-khora.onrender.com
API_TURMA_BASE_URL=https://api-turma-khora.onrender.com
API_AVALIACAO_BASE_URL=https://api-avaliacao-khora.onrender.com
BFF_PUBLIC_URL=https://bff-khora.onrender.com
```

## Rotas Do BFF

### Sistema

- `GET /` - metadados da API
- `GET /api/v1/health` - health check
- `GET /api/v1/status` - status do BFF
- `GET /docs` - Swagger UI
- `GET /docs.json` - especificacao OpenAPI

### API Auth

- `POST /api/v1/auth/user` - cria usuario
- `POST /api/v1/auth/user/signin` - autentica usuario e retorna JWT
- `GET /api/v1/auth/user?role=Aluno|Professor|Administrador` - lista usuarios com filtro opcional por role
- `GET /api/v1/auth/user/whoami` - retorna o usuario autenticado pelo token JWT
- `GET /api/v1/auth/user/:identifier` - busca usuario por ID numerico ou nome parcial
- `GET /api/v1/auth/users?ids=10,25,30` - busca multiplos usuarios por IDs

Regras principais:

- `POST /api/v1/auth/user` cria um registro em `user` e um registro em `person`, vinculando `person.user_id = user.id`.
- Campos obrigatorios no cadastro: `username`, `password`, `role`, `name` e `email`.
- Campos opcionais no cadastro: `cpf` e `birth`.
- Roles aceitas: `Aluno`, `Professor` e `Administrador`.
- `POST /api/v1/auth/user/signin` retorna `token` e `role`.
- O `role` retornado prioriza `person.role` quando houver pessoa vinculada; caso contrario usa `user.role`.
- Rotas privadas exigem `Authorization: Bearer <token>`.
- `GET /api/v1/auth/user/:identifier` busca por `user.id` quando `identifier` e numerico, ou por nome parcial em `person.name` quando e texto.
- `GET /api/v1/auth/users?ids=...` remove IDs duplicados, limita a 100 IDs e retorna apenas usuarios encontrados.

### API IA

- `GET /api/v1/ia/health` - health check da API IA
- `POST /api/v1/ia/assessments` - cria avaliacao escolar
- `GET /api/v1/ia/assessments` - lista avaliacoes salvas com filtros opcionais
- `POST /api/v1/ia/assessments/:assessmentId/revisions` - cria revisao da avaliacao

Filtros opcionais de `GET /api/v1/ia/assessments`:

- `subject`
- `gradeLevel`
- `classroomMaterial`
- `assessmentType`
- `assessmentId`
- `questionCount`
- `difficulty`
- `teacherInstructions`

Regras principais:

- `POST /api/v1/ia/assessments` cria uma avaliacao a partir do material usado em aula e salva a versao inicial.
- A API IA persiste os dados originais em `assessments` e cada versao gerada ou revisada em `assessment_versions`.
- Sem query params, `GET /api/v1/ia/assessments` retorna todas as avaliacoes.
- `assessmentId` nao e obrigatorio; use `GET /api/v1/ia/assessments?assessmentId=uuid` somente para buscar por identificador.
- Revisoes usam o material original, a avaliacao atual e o pedido de ajuste do professor.

### API Turma

- `GET /api/v1/turma/health` - health check da API Turma
- `POST /api/v1/turma/classrooms` - cria turma
- `GET /api/v1/turma/classrooms` - lista turmas
- `GET /api/v1/turma/classrooms/:id/members` - lista turmas de um usuario vinculado
- `GET /api/v1/turma/classrooms/:id` - busca turma por ID
- `GET /api/v1/turma/classrooms/:id/classrooms` - lista membros de uma turma
- `POST /api/v1/turma/classrooms/:id/teachers` - vincula professor a turma
- `DELETE /api/v1/turma/classrooms/:id/teachers` - remove professor da turma
- `POST /api/v1/turma/classrooms/:id/students` - vincula aluno a turma
- `DELETE /api/v1/turma/classrooms/:id/students` - remove aluno da turma

Regras principais:

- `POST /api/v1/turma/classrooms` cria turma com `name` e `schoolYear`.
- A criacao de turma nao recebe `teacherId`.
- Professores devem ser vinculados depois com `POST /api/v1/turma/classrooms/:id/teachers`.
- O modelo `Classroom` nao possui mais `teacherId`; os vinculos ficam em `classroom_members`.
- `GET /api/v1/turma/classrooms/:id/members` usa `id` como `userId` numerico.
- `GET /api/v1/turma/classrooms/:id` usa `id` como UUID da turma.
- `GET /api/v1/turma/classrooms/:id/classrooms` lista os membros da turma.

### API Avaliacao

- `GET /api/v1/avaliacao/health` - health check da API Avaliacao
- `GET|POST /api/v1/avaliacao/exams` - lista ou cria avaliacoes
- `GET /api/v1/avaliacao/exams/upcoming?classroomId=...` - lista proximas avaliacoes da turma
- `POST /api/v1/avaliacao/exams/import/api-ia/:assessmentId` - importa avaliacao e questoes da API-IA
- `GET /api/v1/avaliacao/exams/import/api-ia?classroomId=...` - lista somente avaliacoes importadas da API-IA
- `GET|PUT|DELETE /api/v1/avaliacao/exams/:id` - consulta, atualiza ou remove uma avaliacao
- `GET|POST /api/v1/avaliacao/questions` - lista ou cria questoes
- `GET|PUT|DELETE /api/v1/avaliacao/questions/:id` - consulta, atualiza ou remove uma questao
- `GET|POST /api/v1/avaliacao/submissions` - lista ou cria submissoes
- `GET|PUT|DELETE /api/v1/avaliacao/submissions/:id` - consulta, atualiza ou remove uma submissao
- `GET|POST /api/v1/avaliacao/answers` - lista ou cria respostas
- `GET|PUT|DELETE /api/v1/avaliacao/answers/:id` - consulta, atualiza ou remove uma resposta

As queries aceitas pelo microsservico sao repassadas integralmente. O BFF tambem encaminha o header `Authorization` quando informado.

Regras principais:

- A importacao da API-IA exige `classroomId` e `teacherId` no corpo e cria ou atualiza o exame pelo `assessmentId`.
- A listagem de importacoes aceita os filtros opcionais `classroomId`, `teacherId` e `status`.
- Avaliacoes usam os estados `DRAFT`, `PUBLISHED`, `CLOSED` e `CORRECTED`.
- Questoes podem ser `MULTIPLE_CHOICE`, `TRUE_FALSE` ou `ESSAY`; questoes objetivas sao corrigidas automaticamente.
- Submissoes seguem `NOT_STARTED`, `IN_PROGRESS`, `SUBMITTED` e `CORRECTED`.
- Apenas respostas dissertativas aceitam correcao manual com `score`, `feedback` e `isCorrect`.

## Docker

```bash
docker build -f docker/Dockerfile -t bff:local .
docker run --rm -p 3000:3000 --env-file .env bff:local
```

## CI/CD

O workflow em `.github/workflows/ci.yml` executa:

- testes com Node.js 22
- scan de vulnerabilidades com Trivy
- build e push da imagem Docker em pushes para `main` ou tags
- deploy no Render quando as credenciais estiverem configuradas
