module.exports = {
  keys: 'random-string',
  mysql: {
    client: {
      host: '172.17.0.3',
      port: '3306',
      user: 'yyrlbeta',
      password: 'kdi3jpAa*',
      database: 'yyrlbeta'
    }
  },
  listen: {
    port: 7001,
    hostname: '0.0.0.0'
  },
  security: {
    csrf: {
      enable: true,
      ignoreJSON: true
    }
  },
  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }
}
