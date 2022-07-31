'use strict';

exports.login = async ctx => {
  // 数据库验证，成功后写入cookie
  const res = {
    usercode: ctx.request.body.usercode,
  };
  const token = await ctx.app.jwt.sign(res, ctx.app.config.verify.secret, {
    expiresIn: '10m',
  });
  // 从数据路查询上次登录时间，在有效期内直接登录并更新登录时间
  ctx.cookies.set('WEBTOKEN', token);
  ctx.body = { result: 0, WEBTOKEN: token };
};

exports.logout = async ctx => {
  ctx.cookies.set('WEBTOKEN', null);
  ctx.status = 204;
};
