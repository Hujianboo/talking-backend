const User = require('../models/users');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');
class UsersCtl {
  async find(ctx) {
    console.log('find')
    ctx.body = await User.find();
    console.log(ctx.body);
  }
  async findById(ctx) {
    const { fields } = ctx.query;
    console.log(fields)
    const selectFields = fields.split(';').map(f => ' +' + f).join('');
    console.log(selectFields)
    const user = await User.findById(ctx.params.id).select(selectFields);
    // const user = await User.findById(ctx.params.id);
    if (!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user;
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: {type: 'string', required: true}
    });
    const {name} = ctx.request.body;
    const repeatedUser = await User.findOne({name:name})
    if(repeatedUser){
      ctx.throw(409,'已存在该用户')
    }
    await new User(ctx.request.body).save();
    const user = await User.findOne({name:name})
    ctx.body = user;
  }
  async checkOwner(ctx,next){
    if(ctx.params.id !== ctx.state.user._id) {ctx.throw(403,'没有权限');}
    await next()
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true}
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user;
  }
  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) { ctx.throw(404, '用户不存在'); }
    ctx.status = 204;
  }
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true}
    })
    const user = await User.findOne(ctx.request.body);
    if(!user) {ctx.throw(401,'用户名或密码不正确')};
    const {_id, name} = user;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
    ctx.body = {token};
  }
}

module.exports = new UsersCtl();