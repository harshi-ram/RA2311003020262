const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const { method, path } = req;

  console.log(`[${new Date().toISOString()}] ${method} ${path}`);

  const originalSend = res.send;

  res.send = function (data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    console.log(
      `[${new Date().toISOString()}] ${method} ${path} - Status: ${statusCode} - Duration: ${duration}ms`
    );

    return originalSend.call(this, data);
  };

  next();
};

module.exports = loggingMiddleware;
