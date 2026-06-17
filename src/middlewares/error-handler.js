function notFoundHandler(req, res) {
  res.status(404).json({
    error: `Rota ${req.method} ${req.originalUrl} nao encontrada`
  });
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode ?? 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: err.message ?? 'Erro interno do servidor'
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
