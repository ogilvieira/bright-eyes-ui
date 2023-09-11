const serverFactory = require('spa-server');

var server = serverFactory.create({
  path: './dist',
  hostname: '0.0.0.0',
  port: (process.env.PORT ?? 3000),
  fallback: '/index.html'
});

server.start();
