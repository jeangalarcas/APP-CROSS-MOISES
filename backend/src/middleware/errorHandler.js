export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
  });
}

export function errorHandler(err, req, res, next) {
  console.error('❌ Erro:', err);

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
