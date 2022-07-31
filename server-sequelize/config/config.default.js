'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // add your config here
  config.middleware = ['verify'];
  config.verify = {
    exclude: ['/login'],
    secret: 'amingxiansen',
  };

  // change to your own sequelize configurations
  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'vis-board',
    username: 'root',
    password: '',
  };

  config.security = {
    csrf: {
      // headerName: 'x-csrf-token', // 自定义请求头
      enable: false,
    },
  };

  config.cookies = {
    httpOnly: true,
    sameSite: 'lax',
  };

  return config;
};
