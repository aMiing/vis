'use strict';
const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
// const htmlClient = `<!DOCTYPE html>
// <html lang="en">
// <head>

// <title>ssr首页</title>
// </head>
// <body>
// <noscript>Sorry, we need js to run correctly!</noscript>
// <div id="root"></div>

// </body>
// </html>`;

class TemplapateController extends Controller {
  index() {
    // await this.ctx.render('index.html');
    const { ctx } = this;
    ctx.response.type = 'html';
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/index.html'));
  }
}

module.exports = TemplapateController;
