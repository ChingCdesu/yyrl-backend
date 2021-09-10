module.exports = {
  keys: 'random-string',
  mysql: {
    client: {
      host: 'sh-cynosdbmysql-grp-ogztswdw.sql.tencentcdb.com',
      port: '29237',
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
