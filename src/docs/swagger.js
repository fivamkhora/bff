const env = require('../config/env');

const assessmentExample = {
  subject: 'Ciencias',
  gradeLevel: '6 ano',
  classroomMaterial: 'A aula abordou o ciclo da agua, incluindo evaporacao, condensacao, precipitacao e infiltracao.',
  assessmentType: 'prova',
  questionCount: 10,
  difficulty: 'medio',
  teacherInstructions: 'Inclua duas questoes dissertativas.'
};

const assessmentResponseExample = {
  data: {
    id: 'uuid',
    currentVersion: {
      version: 1,
      assessment: {
        title: 'Avaliacao de Ciencias',
        instructions: 'Leia com atencao.',
        questions: [],
        answerKey: []
      }
    },
    versions: []
  }
};

const classroomExample = {
  id: 'uuid-da-turma',
  name: 'Turma 1A',
  code: 'TURMA-ABC123',
  schoolYear: '2026',
  teacherId: 1,
  createdAt: '2026-06-28T00:00:00.000Z',
  updatedAt: '2026-06-28T00:00:00.000Z'
};

const classroomMemberExample = {
  id: 'uuid-do-vinculo',
  classroomId: 'uuid-da-turma',
  userId: 10,
  role: 'Professor',
  createdAt: '2026-07-05T00:00:00.000Z'
};

const authUserExample = {
  id: 1,
  username: 'maria',
  role: 'Aluno',
  cpf: '00000000000',
  name: 'Maria',
  birth: '2000-01-01T00:00:00.000Z',
  email: 'maria@example.com',
  user_id: 1
};

const authUserDetailsExample = {
  id: 1,
  username: 'maria',
  role: 'Aluno',
  cpf: '00000000000',
  name: 'Maria',
  birth: '2000-01-01',
  email: 'maria@example.com',
  user_id: 1
};

const authWhoamiExample = {
  id: 1,
  username: 'maria',
  name: 'Maria',
  email: 'maria@example.com',
  role: 'Aluno'
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'BFF API',
    version: env.apiVersion,
    description: 'Documentacao das rotas do Backend For Frontend.'
  },
  servers: [
    {
      url: '/',
      description: 'Servidor atual'
    }
  ],
  tags: [
    {
      name: 'Sistema',
      description: 'Rotas de metadados, saude e status'
    },
    {
      name: 'Usuarios',
      description: 'Rotas agregadas para usuarios'
    },
    {
      name: 'APIAUTH',
      description: 'Rotas do BFF para consumir a API Auth'
    },
    {
      name: 'APIIA',
      description: 'Rotas do BFF para consumir a api-ia'
    },
    {
      name: 'APITURMA',
      description: 'Rotas do BFF para consumir a API Turma'
    }
  ],
  paths: {
    '/': {
      get: {
        summary: 'Retorna metadados da API',
        tags: ['Sistema'],
        responses: {
          200: {
            description: 'Metadados do BFF',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'bff' },
                    version: { type: 'string', example: '1.0.0' },
                    docs: { type: 'string', example: '/docs' },
                    health: { type: 'string', example: '/api/v1/health' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/health': {
      get: {
        summary: 'Verifica a saude da API',
        tags: ['Sistema'],
        responses: {
          200: {
            description: 'API disponivel',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/status': {
      get: {
        summary: 'Retorna informacoes de status do BFF',
        tags: ['Sistema'],
        responses: {
          200: {
            description: 'Status atual do BFF',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StatusResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/users/me': {
      get: {
        summary: 'Retorna o usuario autenticado',
        tags: ['Usuarios'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Usuario autenticado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserMeResponse'
                }
              }
            }
          },
          401: {
            description: 'Token nao informado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/user': {
      post: {
        summary: 'Cria um usuario pela API Auth',
        tags: ['APIAUTH'],
        description: 'Cria um usuario com senha criptografada e cria tambem um registro em person, vinculando person.user_id = user.id. name e email sao obrigatorios; cpf e birth sao opcionais.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateAuthUserRequest'
              },
              example: {
                username: 'maria',
                password: '123456',
                role: 'Aluno',
                name: 'Maria',
                email: 'maria@example.com',
                cpf: '00000000000',
                birth: '2000-01-01'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuario criado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthUser'
                },
                example: authUserExample
              }
            }
          },
          400: {
            description: 'Erro de validacao',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthErrorResponse'
                }
              }
            }
          },
          502: {
            description: 'Falha ao consultar a API Auth',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      get: {
        summary: 'Lista todos os usuarios pela API Auth',
        tags: ['APIAUTH'],
        security: [{ bearerAuth: [] }],
        description: 'Rota privada. Envie Authorization: Bearer <token>. Retorna usuarios registrados/criados, sem senha ou campos sensiveis. O filtro role e opcional.',
        parameters: [
          {
            name: 'role',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['Aluno', 'Professor']
            },
            description: 'Filtro opcional por role.'
          }
        ],
        responses: {
          200: {
            description: 'Lista de usuarios registrados',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/AuthUserDetails'
                  }
                },
                example: [authUserDetailsExample]
              }
            }
          },
          400: {
            description: 'Role invalida. Use Aluno ou Professor.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthErrorResponse'
                }
              }
            }
          },
          401: {
            description: 'Token ausente ou invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthErrorResponse'
                },
                example: {
                  message: 'Unauthorized'
                }
              }
            }
          },
          502: {
            description: 'Falha ao consultar a API Auth',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/user/signin': {
      post: {
        summary: 'Autentica usuario pela API Auth',
        tags: ['APIAUTH'],
        description: 'Autentica com username e password. Retorna JWT e role. O role retornado usa person.role quando houver pessoa vinculada; caso contrario usa user.role.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthSigninRequest'
              },
              example: {
                username: 'maria',
                password: '123456'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login efetuado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthSigninResponse'
                },
                example: {
                  token: '<jwt>',
                  role: 'Aluno'
                }
              }
            }
          },
          401: {
            description: 'Credenciais invalidas',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthErrorResponse'
                },
                example: {
                  message: 'Username or password is incorrect'
                }
              }
            }
          },
          502: {
            description: 'Falha ao consultar a API Auth',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/user/whoami': {
      get: {
        summary: 'Retorna o usuario autenticado pela API Auth',
        tags: ['APIAUTH'],
        security: [{ bearerAuth: [] }],
        description: 'Rota privada. Envie Authorization: Bearer <token>. A API usa o sub do JWT para buscar o usuario autenticado.',
        responses: {
          200: {
            description: 'Usuario autenticado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthWhoamiResponse'
                },
                example: authWhoamiExample
              }
            }
          },
          401: {
            description: 'Token ausente ou invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthErrorResponse'
                },
                example: {
                  message: 'Unauthorized'
                }
              }
            }
          },
          404: {
            description: 'Usuario nao encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthErrorResponse'
                },
                example: {
                  message: 'Resource not found'
                }
              }
            }
          },
          502: {
            description: 'Falha ao consultar a API Auth',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/users': {
      get: {
        summary: 'Busca multiplos usuarios por IDs pela API Auth',
        tags: ['APIAUTH'],
        security: [{ bearerAuth: [] }],
        description: 'Rota privada. Envie Authorization: Bearer <token>. Recebe ids como string separada por virgula, remove duplicados, limita a 100 IDs por requisicao e retorna apenas usuarios encontrados.',
        parameters: [
          {
            name: 'ids',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              example: '10,25,30,31'
            },
            description: 'IDs numericos separados por virgula. Cada ID deve ser maior que zero.'
          }
        ],
        responses: {
          200: {
            description: 'Lista de usuarios encontrados. Retorna array vazio quando nenhum usuario for encontrado.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/AuthUserDetails'
                  }
                },
                example: [
                  {
                    id: 10,
                    username: 'joao.professor',
                    role: 'Professor',
                    cpf: '11111111111',
                    name: 'Joao Professor Exemplo',
                    birth: '1980-01-01',
                    email: 'joao.professor@example.com',
                    user_id: 10
                  },
                  {
                    id: 25,
                    username: 'jose.aluno',
                    role: 'Aluno',
                    cpf: '22222222222',
                    name: 'Jose Aluno Exemplo',
                    birth: '2005-01-01',
                    email: 'jose.aluno@example.com',
                    user_id: 25
                  }
                ]
              }
            }
          },
          400: {
            description: 'Parametro ids ausente ou invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthErrorResponse'
                }
              }
            }
          },
          401: {
            description: 'Token ausente ou invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthErrorResponse'
                },
                example: {
                  message: 'Unauthorized'
                }
              }
            }
          },
          502: {
            description: 'Falha ao consultar a API Auth',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/user/{identifier}': {
      get: {
        summary: 'Busca usuario por ID numerico ou nome parcial pela API Auth',
        tags: ['APIAUTH'],
        security: [{ bearerAuth: [] }],
        description: 'Rota privada. Envie Authorization: Bearer <token>. Quando identifier e numerico, busca por user.id. Quando e texto, busca por nome parcial em person.name e pode retornar uma lista. A API faz LEFT JOIN entre user e person por person.user_id = user.id.',
        parameters: [
          {
            name: 'identifier',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '1'
            }
          }
        ],
        responses: {
          200: {
            description: 'Usuario encontrado por ID ou lista de usuarios por nome parcial',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/AuthUserDetails' },
                    {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/AuthUserDetails'
                      }
                    }
                  ]
                },
                example: authUserDetailsExample
              }
            }
          },
          401: {
            description: 'Token ausente ou invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthErrorResponse'
                },
                example: {
                  message: 'Unauthorized'
                }
              }
            }
          },
          404: {
            description: 'Usuario nao encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthErrorResponse'
                },
                example: {
                  message: 'Resource not found'
                }
              }
            }
          },
          502: {
            description: 'Falha ao consultar a API Auth',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/ia/health': {
      get: {
        summary: 'Verifica a saude da api-ia pelo BFF',
        tags: ['APIIA'],
        description: `Encaminha a chamada para ${env.apiIaBaseUrl}/api/v1/health.`,
        responses: {
          200: {
            description: 'api-ia disponivel',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse'
                }
              }
            }
          },
          502: {
            description: 'Falha ao consultar a api-ia',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/ia/assessments': {
      post: {
        summary: 'Cria uma avaliacao escolar pela api-ia',
        tags: ['APIIA'],
        description: 'Cria uma avaliacao a partir do material da aula, gera a versao inicial com IA e salva em PostgreSQL. A api-ia usa assessments para os dados originais e assessment_versions para cada versao gerada ou revisada.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateAssessmentRequest'
              },
              example: assessmentExample
            }
          }
        },
        responses: {
          200: {
            description: 'Avaliacao criada',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AssessmentResponse'
                },
                example: assessmentResponseExample
              }
            }
          },
          502: {
            description: 'Falha ao consultar a api-ia',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      get: {
        summary: 'Lista todas as avaliacoes ou filtra resultados pela api-ia',
        tags: ['APIIA'],
        description: 'Todos os query params sao opcionais. Sem filtros, retorna todas as avaliacoes salvas. Envie um ou mais filtros somente quando quiser restringir a busca.',
        parameters: [
          {
            name: 'subject',
            in: 'query',
            required: false,
            description: 'Filtro opcional por disciplina.',
            schema: { type: 'string' },
            example: 'Ciencias'
          },
          {
            name: 'gradeLevel',
            in: 'query',
            required: false,
            description: 'Filtro opcional por serie ou ano escolar.',
            schema: { type: 'string' },
            example: '6 ano'
          },
          {
            name: 'classroomMaterial',
            in: 'query',
            required: false,
            description: 'Filtro opcional pelo material usado em aula.',
            schema: { type: 'string' }
          },
          {
            name: 'assessmentType',
            in: 'query',
            required: false,
            description: 'Filtro opcional por tipo de avaliacao.',
            schema: { type: 'string' },
            example: 'prova'
          },
          {
            name: 'assessmentId',
            in: 'query',
            required: false,
            description: 'Filtro opcional por identificador. Deixe vazio para listar todas ou combine com outros filtros.',
            schema: { type: 'string' },
            example: 'uuid'
          },
          {
            name: 'questionCount',
            in: 'query',
            required: false,
            description: 'Filtro opcional pela quantidade de questoes.',
            schema: { type: 'integer' },
            example: 10
          },
          {
            name: 'difficulty',
            in: 'query',
            required: false,
            description: 'Filtro opcional por dificuldade.',
            schema: { type: 'string' },
            example: 'medio'
          },
          {
            name: 'teacherInstructions',
            in: 'query',
            required: false,
            description: 'Filtro opcional pelas instrucoes do professor.',
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Lista de avaliacoes salvas',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AssessmentListResponse'
                },
                example: {
                  data: [assessmentResponseExample.data]
                }
              }
            }
          },
          502: {
            description: 'Falha ao consultar a api-ia',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/ia/assessments/{assessmentId}/revisions': {
      post: {
        summary: 'Cria uma nova versao da avaliacao pela api-ia',
        tags: ['APIIA'],
        description: 'Cria uma nova versao a partir do material original da aula, da avaliacao atual e do pedido de ajuste do professor. A nova versao e salva no historico.',
        parameters: [
          {
            name: 'assessmentId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateAssessmentRevisionRequest'
              },
              example: {
                adjustmentRequest: 'Troque a questao 2 aberta por uma questao de multipla escolha.'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Nova versao criada',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AssessmentResponse'
                },
                example: assessmentResponseExample
              }
            }
          },
          404: {
            description: 'Avaliacao nao encontrada'
          },
          502: {
            description: 'Falha ao consultar a api-ia',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/turma/health': {
      get: {
        summary: 'Verifica a saude da API Turma pelo BFF',
        tags: ['APITURMA'],
        description: `Encaminha a chamada para ${env.apiTurmaBaseUrl}/.`,
        responses: {
          200: {
            description: 'API Turma disponivel',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'Hello World!'
                }
              }
            }
          },
          502: {
            description: 'Falha ao consultar a API Turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/turma/classrooms': {
      post: {
        summary: 'Cria uma turma pela API Turma',
        tags: ['APITURMA'],
        description: 'O frontend deve consumir esta rota do BFF. O BFF encaminha a chamada para a API Turma.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateClassroomRequest'
              },
              example: {
                name: 'Turma 1A',
                schoolYear: '2026',
                teacherId: 1
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Turma criada',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Classroom'
                },
                example: classroomExample
              }
            }
          },
          200: {
            description: 'Turma criada',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Classroom'
                },
                example: classroomExample
              }
            }
          },
          400: {
            description: 'Dados invalidos'
          },
          502: {
            description: 'Falha ao consultar a API Turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      get: {
        summary: 'Lista turmas pela API Turma',
        tags: ['APITURMA'],
        description: 'Encaminha a chamada para a listagem de turmas da API Turma.',
        responses: {
          200: {
            description: 'Lista de turmas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Classroom'
                  }
                },
                example: [classroomExample]
              }
            }
          },
          502: {
            description: 'Falha ao consultar a API Turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/turma/classrooms/{id}/members': {
      get: {
        summary: 'Lista turmas por usuario vinculado pela API Turma',
        tags: ['APITURMA'],
        description: 'Encaminha a chamada para listar as turmas em que o usuario informado esta vinculado. O parametro id representa o userId numerico.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'number',
              example: 10
            },
            description: 'Identificador numerico do usuario vinculado'
          }
        ],
        responses: {
          200: {
            description: 'Lista de turmas vinculadas ao usuario. Retorna lista vazia quando nao houver vinculos.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Classroom'
                  }
                },
                example: [classroomExample]
              }
            }
          },
          502: {
            description: 'Falha ao consultar a API Turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/turma/classrooms/{id}': {
      get: {
        summary: 'Busca turma por ID pela API Turma',
        tags: ['APITURMA'],
        description: 'Encaminha a chamada para buscar uma turma individual pelo UUID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            },
            description: 'UUID da turma'
          }
        ],
        responses: {
          200: {
            description: 'Turma encontrada',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Classroom'
                },
                example: classroomExample
              }
            }
          },
          404: {
            description: 'Turma nao encontrada'
          },
          502: {
            description: 'Falha ao consultar a API Turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/turma/classrooms/{id}/teachers': {
      post: {
        summary: 'Vincula professor a uma turma pela API Turma',
        tags: ['APITURMA'],
        description: 'Cria um vinculo em classroom_members com role Professor. A combinacao classroomId + userId deve ser unica.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            },
            description: 'UUID da turma'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AddClassroomMemberRequest'
              },
              example: {
                userId: 10
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Professor vinculado a turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ClassroomMember'
                },
                example: classroomMemberExample
              }
            }
          },
          404: {
            description: 'Turma nao encontrada'
          },
          409: {
            description: 'Usuario ja vinculado a esta turma'
          },
          502: {
            description: 'Falha ao consultar a API Turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Remove professor de uma turma pela API Turma',
        tags: ['APITURMA'],
        description: 'Remove o vinculo de professor da turma. Em caso de sucesso, a API responde com 204 No Content.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            },
            description: 'UUID da turma'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AddClassroomMemberRequest'
              },
              example: {
                userId: 10
              }
            }
          }
        },
        responses: {
          204: {
            description: 'Professor removido da turma'
          },
          404: {
            description: 'Turma nao encontrada ou professor nao encontrado na turma'
          },
          502: {
            description: 'Falha ao consultar a API Turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/turma/classrooms/{id}/students': {
      post: {
        summary: 'Vincula aluno a uma turma pela API Turma',
        tags: ['APITURMA'],
        description: 'Cria um vinculo em classroom_members com role Aluno. A combinacao classroomId + userId deve ser unica.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            },
            description: 'UUID da turma'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AddClassroomMemberRequest'
              },
              example: {
                userId: 25
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Aluno vinculado a turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ClassroomMember'
                },
                example: {
                  ...classroomMemberExample,
                  userId: 25,
                  role: 'Aluno'
                }
              }
            }
          },
          404: {
            description: 'Turma nao encontrada'
          },
          409: {
            description: 'Usuario ja vinculado a esta turma'
          },
          502: {
            description: 'Falha ao consultar a API Turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Remove aluno de uma turma pela API Turma',
        tags: ['APITURMA'],
        description: 'Remove o vinculo de aluno da turma. Em caso de sucesso, a API responde com 204 No Content.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            },
            description: 'UUID da turma'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AddClassroomMemberRequest'
              },
              example: {
                userId: 25
              }
            }
          }
        },
        responses: {
          204: {
            description: 'Aluno removido da turma'
          },
          404: {
            description: 'Turma nao encontrada ou aluno nao encontrado na turma'
          },
          502: {
            description: 'Falha ao consultar a API Turma',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Mensagem de erro'
          }
        }
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok'
          },
          uptime: {
            type: 'number',
            example: 12.34
          },
          timestamp: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      StatusResponse: {
        type: 'object',
        properties: {
          service: { type: 'string', example: 'bff' },
          environment: { type: 'string', example: 'production' },
          version: { type: 'string', example: '1.0.0' },
          node: { type: 'string', example: 'v22.11.0' }
        }
      },
      UserMeResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'me' },
          authenticated: { type: 'boolean', example: true },
          tokenPreview: { type: 'string', example: 'eyJhbGci...' }
        }
      },
      AuthErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Unauthorized'
          },
          issues: {
            type: 'object',
            nullable: true,
            additionalProperties: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        }
      },
      CreateAuthUserRequest: {
        type: 'object',
        required: ['username', 'password', 'role', 'name', 'email'],
        properties: {
          username: {
            type: 'string',
            example: 'maria'
          },
          password: {
            type: 'string',
            format: 'password',
            example: '123456'
          },
          role: {
            type: 'string',
            enum: ['Aluno', 'Professor'],
            example: 'Aluno'
          },
          name: {
            type: 'string',
            example: 'Maria'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'maria@example.com'
          },
          cpf: {
            type: 'string',
            nullable: true,
            example: '00000000000'
          },
          birth: {
            type: 'string',
            format: 'date',
            nullable: true,
            example: '2000-01-01'
          }
        }
      },
      AuthSigninRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'maria'
          },
          password: {
            type: 'string',
            format: 'password',
            example: '123456'
          }
        }
      },
      AuthSigninResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: '<jwt>'
          },
          role: {
            type: 'string',
            enum: ['Aluno', 'Professor'],
            example: 'Aluno'
          }
        }
      },
      AuthWhoamiResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: authWhoamiExample.id
          },
          username: {
            type: 'string',
            example: authWhoamiExample.username
          },
          name: {
            type: 'string',
            example: authWhoamiExample.name
          },
          email: {
            type: 'string',
            format: 'email',
            example: authWhoamiExample.email
          },
          role: {
            type: 'string',
            enum: ['Aluno', 'Professor'],
            example: authWhoamiExample.role
          }
        }
      },
      AuthUser: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: authUserExample.id
          },
          username: {
            type: 'string',
            example: authUserExample.username
          },
          role: {
            type: 'string',
            enum: ['Aluno', 'Professor'],
            example: authUserExample.role
          },
          cpf: {
            type: 'string',
            example: authUserExample.cpf
          },
          name: {
            type: 'string',
            example: authUserExample.name
          },
          birth: {
            type: 'string',
            format: 'date-time',
            example: authUserExample.birth
          },
          email: {
            type: 'string',
            format: 'email',
            example: authUserExample.email
          },
          user_id: {
            type: 'integer',
            example: authUserExample.user_id
          }
        }
      },
      AuthUserDetails: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: authUserDetailsExample.id
          },
          username: {
            type: 'string',
            example: authUserDetailsExample.username
          },
          role: {
            type: 'string',
            enum: ['Aluno', 'Professor'],
            example: authUserDetailsExample.role
          },
          cpf: {
            type: 'string',
            example: authUserDetailsExample.cpf
          },
          name: {
            type: 'string',
            example: authUserDetailsExample.name
          },
          birth: {
            type: 'string',
            format: 'date',
            example: authUserDetailsExample.birth
          },
          email: {
            type: 'string',
            format: 'email',
            example: authUserDetailsExample.email
          },
          user_id: {
            type: 'integer',
            example: authUserDetailsExample.user_id
          }
        }
      },
      CreateAssessmentRequest: {
        type: 'object',
        required: [
          'subject',
          'gradeLevel',
          'classroomMaterial',
          'assessmentType',
          'questionCount',
          'difficulty'
        ],
        properties: {
          subject: { type: 'string', example: assessmentExample.subject },
          gradeLevel: { type: 'string', example: assessmentExample.gradeLevel },
          classroomMaterial: { type: 'string', example: assessmentExample.classroomMaterial },
          assessmentType: { type: 'string', example: assessmentExample.assessmentType },
          questionCount: { type: 'integer', example: assessmentExample.questionCount },
          difficulty: { type: 'string', example: assessmentExample.difficulty },
          teacherInstructions: { type: 'string', example: assessmentExample.teacherInstructions }
        }
      },
      CreateAssessmentRevisionRequest: {
        type: 'object',
        required: ['adjustmentRequest'],
        properties: {
          adjustmentRequest: {
            type: 'string',
            example: 'Troque a questao 2 aberta por uma questao de multipla escolha.'
          }
        }
      },
      CreateClassroomRequest: {
        type: 'object',
        required: ['name', 'schoolYear', 'teacherId'],
        properties: {
          name: {
            type: 'string',
            example: 'Turma 1A'
          },
          schoolYear: {
            type: 'string',
            example: '2026'
          },
          teacherId: {
            type: 'number',
            example: 1
          }
        }
      },
      Classroom: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: classroomExample.id
          },
          name: {
            type: 'string',
            example: classroomExample.name
          },
          code: {
            type: 'string',
            example: classroomExample.code
          },
          schoolYear: {
            type: 'string',
            example: classroomExample.schoolYear
          },
          teacherId: {
            type: 'number',
            example: classroomExample.teacherId
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: classroomExample.createdAt
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: classroomExample.updatedAt
          }
        }
      },
      AddClassroomMemberRequest: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: {
            type: 'number',
            example: 10
          }
        }
      },
      ClassroomMember: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: classroomMemberExample.id
          },
          classroomId: {
            type: 'string',
            format: 'uuid',
            example: classroomMemberExample.classroomId
          },
          userId: {
            type: 'number',
            example: classroomMemberExample.userId
          },
          role: {
            type: 'string',
            enum: ['Professor', 'Aluno'],
            example: classroomMemberExample.role
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: classroomMemberExample.createdAt
          }
        }
      },
      AssessmentResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid'
              },
              currentVersion: {
                $ref: '#/components/schemas/AssessmentVersion'
              },
              versions: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/AssessmentVersion'
                }
              }
            }
          }
        }
      },
      AssessmentListResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid'
                },
                currentVersion: {
                  $ref: '#/components/schemas/AssessmentVersion'
                },
                versions: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/AssessmentVersion'
                  }
                }
              }
            }
          }
        }
      },
      AssessmentVersion: {
        type: 'object',
        properties: {
          version: {
            type: 'integer',
            example: 1
          },
          assessment: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Avaliacao de Ciencias' },
              instructions: { type: 'string', example: 'Leia com atencao.' },
              questions: {
                type: 'array',
                items: {
                  type: 'object'
                }
              },
              answerKey: {
                type: 'array',
                items: {
                  type: 'object'
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
