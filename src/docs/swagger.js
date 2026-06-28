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
        description: 'Cria um usuario com senha criptografada. O objeto person e opcional; quando informado, a API cria o registro complementar e vincula com person.user_id = user.id.',
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
                person: {
                  cpf: '00000000000',
                  name: 'Maria',
                  birth: '2000-01-01',
                  email: 'maria@example.com'
                }
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
      }
    },
    '/api/v1/auth/user/signin': {
      post: {
        summary: 'Autentica usuario pela API Auth',
        tags: ['APIAUTH'],
        description: 'Autentica com username e password. O campo role retornado usa person.role quando houver pessoa vinculada; caso contrario usa user.role.',
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
                  role: 'Aluno',
                  user: {
                    id: 1,
                    username: 'maria',
                    cpf: '00000000000',
                    name: 'Maria',
                    birth: '2000-01-01T00:00:00.000Z',
                    email: 'maria@example.com',
                    user_id: 1
                  }
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
    '/api/v1/auth/user/{id}': {
      get: {
        summary: 'Busca usuario por ID pela API Auth',
        tags: ['APIAUTH'],
        security: [{ bearerAuth: [] }],
        description: 'Rota privada. Envie Authorization: Bearer <token>. A API faz LEFT JOIN entre user e person por person.user_id = user.id. Quando existe person, prioriza person.role; caso contrario, usa user.role.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Usuario encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthUserDetails'
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
        summary: 'Lista avaliacoes salvas pela api-ia',
        tags: ['APIIA'],
        description: 'Lista avaliacoes persistidas. Sem query params, retorna todas. Para buscar por identificador, envie assessmentId como query param.',
        parameters: [
          {
            name: 'subject',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            example: 'Ciencias'
          },
          {
            name: 'gradeLevel',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            example: '6 ano'
          },
          {
            name: 'classroomMaterial',
            in: 'query',
            required: false,
            schema: { type: 'string' }
          },
          {
            name: 'assessmentType',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            example: 'prova'
          },
          {
            name: 'assessmentId',
            in: 'query',
            required: false,
            schema: { type: 'string', format: 'uuid' },
            example: 'uuid'
          },
          {
            name: 'questionCount',
            in: 'query',
            required: false,
            schema: { type: 'integer' },
            example: 10
          },
          {
            name: 'difficulty',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            example: 'medio'
          },
          {
            name: 'teacherInstructions',
            in: 'query',
            required: false,
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
        required: ['username', 'password', 'role'],
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
          person: {
            $ref: '#/components/schemas/AuthPersonInput'
          }
        }
      },
      AuthPersonInput: {
        type: 'object',
        description: 'Dados complementares opcionais da pessoa vinculada ao usuario.',
        required: ['cpf', 'name', 'birth', 'email'],
        properties: {
          cpf: {
            type: 'string',
            example: '00000000000'
          },
          name: {
            type: 'string',
            example: 'Maria'
          },
          birth: {
            type: 'string',
            format: 'date',
            example: '2000-01-01'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'maria@example.com'
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
          },
          user: {
            $ref: '#/components/schemas/AuthSigninUser'
          }
        }
      },
      AuthSigninUser: {
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
            format: 'date-time',
            example: '2000-01-01T00:00:00.000Z'
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
