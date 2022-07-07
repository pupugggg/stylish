const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
     
    })

  );
  app.use(
    '/uploads',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      
    })

  );
};