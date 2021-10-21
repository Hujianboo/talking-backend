/*
 * @Author: Hujianbo
 * @Date: 2021-10-17 16:50:19
 * @LastEditors: Hujianbo
 * @LastEditTime: 2021-10-17 17:26:17
 * @FilePath: /talking-backend/app/controllers/home.js
 */
const path = require('path')
class HomeCtl {
  index(ctx) {
    ctx.body = '<h1>这是主页</h1>';
  }
  upload(ctx){
    const file = ctx.request.files.file;
    const basename = path.basename(file.path)
    ctx.body = {url: `${ctx.origin}/uploads/${basename}`}
  }
}

module.exports = new HomeCtl();