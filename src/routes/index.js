const { Router } = require('express');

const healthRouter = require('./health.routes');
const statusRouter = require('./status.routes');
const usersRouter = require('./users.routes');

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/status', statusRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
