'use strict';

module.exports = options => {
  return async function jwt(ctx, next) {
    const exclude = options.exclude || [];
    const needVerify = !exclude.some(e => ctx.request.url.match(e) !== null);
    if (needVerify) {
      const token = ctx.cookies.get('WEBTOKEN');
      if (token) {
        try {
          ctx.app.jwt.verify(token, options.secret);
        } catch (error) {
          console.log('error\n', error);
          ctx.status = 401;
          ctx.body = {
            message: error.message,
          };
          return;
        }
      } else {
        ctx.status = 401;
        ctx.body = {
          message: '没有token',
        };
      }
    }
    await next();
  };
};
