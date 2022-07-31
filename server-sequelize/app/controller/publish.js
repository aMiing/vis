'use strict';

const Controller = require('egg').Controller;
function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class PublishController extends Controller {
  async index() {
    const ctx = this.ctx;
    console.log('ctx index--', ctx.query);
    const { limit = 10, offset = 0 } = ctx.query;
    const query = {
      limit: toInt(limit),
      offset: toInt(offset),
      order: [['updated_at', 'DESC']],
    };
    ctx.body = { data: await ctx.model.Publish.findAll(query), result: 0 };
  }

  async new() {
    const ctx = this.ctx;
    console.log('ctx.query', ctx.query);
    ctx.body = ctx.params || { nodata: 'test' };
  }

  async create() {
    const ctx = this.ctx;
    console.log('ctx.request.body', ctx.request.body);
    const { id, originId } = ctx.request.body;
    const panel = await ctx.model.Panel.findAll({
      attributes: { exclude: ['created_at', 'updated_at', 'id'] },
      where: { id: originId },
    });
    const publish = await ctx.model.Publish.create({ ...panel[0].dataValues, id });
    if (publish) {
      ctx.status = 201;
      ctx.body = { result: 0, data: publish };
    } else {
      ctx.status = 500;
      ctx.body = '新增失败';
    }
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = ctx.params || { nodata: 'test' };
  }

  async edit() {
    const ctx = this.ctx;
    ctx.body = ctx.params || { nodata: 'test' };
  }

  async update() {
    const ctx = this.ctx;
    console.log('\nctx\n', ctx.params);
    console.log('\nctx.request.body\n', ctx.request.body);
    const { elements, style } = ctx.request.body;
    const panel = await ctx.model.Publish.update(
      { elements, style },
      {
        where: ctx.params,
      }
    );
    ctx.body = { result: 0, data: panel };
  }

  async destroy() {
    const ctx = this.ctx;
    ctx.body = ctx.params || { nodata: 'test' };
  }
}

module.exports = PublishController;
