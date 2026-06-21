const { Router } = require('express');

const healthRouter = require('./health.routes');
const iaRouter = require('./ia.routes');
const statusRouter = require('./status.routes');
const usersRouter = require('./users.routes');

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/ia', iaRouter);
apiRouter.use('/status', statusRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
