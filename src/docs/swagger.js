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
      name: 'APIIA',
      description: 'Rotas do BFF para consumir a api-ia'
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
        description: 'O frontend deve consumir esta rota do BFF. O BFF encaminha Origin/Referer para a api-ia.',
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
      }
    },
    '/api/v1/ia/assessments/{assessmentId}': {
      get: {
        summary: 'Busca uma avaliacao salva pela api-ia',
        tags: ['APIIA'],
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
        responses: {
          200: {
            description: 'Avaliacao salva, versao atual e historico',
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
    '/api/v1/ia/assessments/{assessmentId}/revisions': {
      post: {
        summary: 'Cria uma nova versao da avaliacao pela api-ia',
        tags: ['APIIA'],
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
