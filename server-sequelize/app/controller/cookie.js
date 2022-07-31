'use strict';
const Controller = require('egg').Controller;
class CookieController extends Controller {
  async add() {
    const ctx = this.ctx;
    let count = ctx.cookies.get('count');
    count = count ? Number(count) : 0;
    ctx.cookies.set('count', ++count);
    ctx.body = count;
  }

  async remove() {
    const ctx = this.ctx;
    ctx.cookies.set('count', null);
    ctx.status = 204;
  }
}

module.exports = CookieController;
