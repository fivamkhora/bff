const env = require('../config/env');

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
      }
    }
  }
};

module.exports = swaggerSpec;
