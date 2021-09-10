'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const chance = require('chance');
const pump = require('mz-modules/pump');

class UserController extends Controller {
  async login() {
    const {
      ctx
    } = this;
    const {
      endata
    } = ctx.request.body;

    ctx.body = await ctx.service.user.login(endata.account, endata.password);
  }

  async register() {
    const {
      ctx
    } = this;
    const {
      endata
    } = ctx.request.body;

    ctx.body = await ctx.service.user.register(endata.account, endata.password, endata.nickname);
  }

  async change() {
    const {
      ctx
    } = this;
    const {
      endata
    } = ctx.request.body;

    switch (endata.action) {
      case 'updnick':
        ctx.body = await ctx.service.user.change_nickname(endata.account, endata.nickname);
        break;
      case 'changpwd':
        ctx.body = await ctx.servive.user.change_password(endata.account, endata.password);
        break;
      case 'integaladd':
        ctx.body = await ctx.service.user.add_point(endata.account, endata.value);
        break;
      case 'userinfo':
        ctx.body = await ctx.service.user.userinfo(endata.account);
        break;
      case 'rank':
        ctx.body = await ctx.service.user.rank(endata.account);
        break;
      case 'myitems':
        ctx.body = await ctx.service.user.get_items(endata.account);
        break;
      case 'newitem':
        ctx.body = await ctx.service.user.add_item(endata.account, endata.item_id);
        break;
      case 'delitem':
        ctx.body = await ctx.service.user.remove_item(endata.account, endata.item_id);
        break;
      case 'complete':
        ctx.body = await ctx.service.user.complete_status(endata.account, endata.complete);
        break;
      case 'answer':
        ctx.body = await ctx.service.user.add_answered(endata.account, endata.question);
        break;
      default:
        break;
    }
  }

  async change_avatar() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const account = stream.fields.account
    
    const ext = path.extname(stream.filename)
    const hash = new chance().hash({ length: 16 })
    const name = hash + ext
    try {
      const target = path.join(this.config.baseDir, 'app/public', name);
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      await ctx.service.user.change_avatar(account, `/public/${name}`);
      ctx.body = {
        endata: {
          su: 1,
          msg: ''
        }
      }
    } catch (e) {
      ctx.body = {
        endata: {
          su: 0,
          msg: `文件上传失败：${e}`
        }
      }
    }
  }
}

module.exports = UserController;
