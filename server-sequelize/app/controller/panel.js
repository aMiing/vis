'use strict';

const Controller = require('egg').Controller;
function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class PanelController extends Controller {
  async index() {
    const ctx = this.ctx;
    console.log('ctx index--', ctx.query);
    const { limit = 10, offset = 0 } = ctx.query;
    const query = {
      limit: toInt(limit),
      offset: toInt(offset),
      attributes: { exclude: ['style', 'elements'] },
      order: [['created_at', 'DESC']],
    };
    ctx.body = { data: await ctx.model.Panel.findAll(query), result: 0 };
  }

  async create() {
    const ctx = this.ctx;
    console.log('ctx.request.body', ctx.request.body);
    const panel = await ctx.model.Panel.create(ctx.request.body);
    if (panel) {
      ctx.status = 201;
      ctx.body = { result: 0, data: panel };
    } else {
      ctx.status = 500;
      ctx.body = '新增失败';
    }
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = {
      data: await ctx.model.Panel.findAll({
        where: {
          id: ctx.params.id,
        },
      }),
      result: 0,
    };
  }

  async update() {
    const ctx = this.ctx;
    console.log('\nctx\n', ctx.params);
    console.log('\nctx.request.body\n', ctx.request.body);
    const panel = await ctx.model.Panel.update(ctx.request.body, {
      where: ctx.params,
    });
    ctx.body = { result: 0, data: panel };
  }

  async destroy() {
    const ctx = this.ctx;
    try {
      const res = await ctx.model.Panel.destroy({
        where: ctx.params,
      });
      ctx.body = { result: 0, data: res };
    } catch (error) {
      ctx.body = { result: 500, data: error };
    }
  }
}

module.exports = PanelController;
