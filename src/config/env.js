const env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  apiVersion: process.env.API_VERSION ?? '1.0.0',
  apiIaBaseUrl: process.env.API_IA_BASE_URL ?? 'https://api-ia-khora.onrender.com',
  apiTurmaBaseUrl: process.env.API_TURMA_BASE_URL ?? 'https://api-turma-khora.onrender.com',
  bffPublicUrl: process.env.BFF_PUBLIC_URL ?? 'https://bff-khora.onrender.com'
};

module.exports = env;
