require('dotenv').config();

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const swaggerSpec = require('./docs/swagger');
const { errorHandler, notFoundHandler } = require('./middlewares/error-handler');
const apiRouter = require('./routes');

const app = express();

app.set('trust proxy', true);
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'test' ? 'tiny' : 'combined'));

app.get('/', (_req, res) => {
  res.json({
    name: 'bff',
    version: env.apiVersion,
    docs: '/docs',
    health: '/api/v1/health'
  });
});

app.get('/docs.json', (_req, res) => {
  res.json(swaggerSpec);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
