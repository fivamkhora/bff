const env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  apiVersion: process.env.API_VERSION ?? '1.0.0'
};

module.exports = env;
