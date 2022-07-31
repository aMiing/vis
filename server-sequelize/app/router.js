'use strict';
const prefix = '/api/';

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.template.index);
  router.post(prefix + 'auth/login', app.controller.login.login);
  router.post(prefix + 'auth/logout', app.controller.login.logout);
  router.resources('user', prefix + 'user', controller.user);
  router.resources('panel', prefix + 'panel', controller.panel);
  router.resources('publish', prefix + 'panel/publish', controller.publish);
};
