
'use strict';

const Service = require('egg').Service;
const CryptoJs = require('crypto-js');
const Chance = require('chance');

class UserService extends Service {
  async login(account, password) {
    const res = {
      endata: {
        su: 0,
        msg: ''
      }
    }
    const hash = CryptoJs.MD5('yyrl' + password).toString();
    try {
      const user = await this.app.mysql.get('users', {
        account,
        password: hash
      });
      if (!user) {
        throw Error('用户名或密码错误')
      }
      const token = new Chance().hash({ length: 32 });
      await this.app.mysql.update('users', {
        id: user.id,
        token
      });
      res.endata.su = 1;
      res.endata.token = token;
      res.endata.userdata = {
        nickname: user.nickname,
        account: user.account,
        avatarimg: user.avaimage
      }
    } catch (e) {
      res.endata.msg = e.message || e
    }
    return res;
  }

  async register(account, password, nickname) {
    const res = {
      endata: {
        su: 0,
        msg: ''
      }
    }

    const hash = CryptoJs.MD5('yyrl' + password).toString();

    try {
      const result = await this.app.mysql.insert('users', {
        account,
        password: hash,
        nickname
      });
      res.endata.su = result.affectedRows;
    } catch (e) {
      res.endata.msg = e.message || e
    }

    return res;
  }
  async change_nick(account, nickname) {
    const res = {
      endata: {
        su: 0,
        msg: ''
      }
    }

    try {
      const result = await this.app.mysql.update('users', {
        nickname
      }, {
        where: {
          account
        }
      });
      res.endata.su = result.affectedRows;
    } catch (e) {
      res.endata.msg = e.message || e
    }

    return res;
  }

  async change_password(account, password) {
    const res = {
      endata: {
        su: 0,
        msg: ''
      }
    }

    try {
      const result = await this.app.mysql.update('users', {
        password
      }, {
        where: {
          account
        }
      });
      res.endata.su = result.affectedRows;
    } catch (e) {
      res.endata.msg = e.message || e
    }

    return res;
  }

  async change_avatar(account, filepath) {
    const res = {
      endata: {
        su: 0,
        msg: ''
      }
    }

    try {
      const result = await this.app.mysql.update('users', {
        avaimage: filepath
      }, {
        where: {
          account
        }
      });
      res.endata.su = result.affectedRows;
    } catch (e) {
      res.endata.msg = e.message || e
    }

    return res;
  }

  async add_point(account, value) {
    const res = {
      endata: {
        su: 0,
        msg: ''
      }
    }

    try {
      const user = await this.app.mysql.select('users', {
        where: {
          account
        },
        limit: 1
      });
      if (user.length === 0) {
        throw Error('user not exist');
      }
      user[0].point += value;
      const result = await this.app.mysql.update('users', {
        id: user[0].id,
        point: user[0].point
      });
      res.endata.su = result.affectedRows;
      if (res.endata.su === 1) {
        res.endata.integral = user[0].point;
      }
    } catch (e) {
      res.endata.msg = e.message || e
    }

    return res;
  }

  async add_item(account, item_id) {
    const res = {
      endata: {
        su: 0,
        msg: ''
      }
    }

    try {
      const user = await this.app.mysql.get('users', {
        account
      });
      if (!user) {
        throw new Error('用户不存在');
      }

      let item = JSON.parse(user.items) || [];
      if (!item_id) {
        throw new Error('物品为空值')
      }
      if (Array.isArray(item_id)) {
        item_id = item_id.filter(v => v !== null && v !== undefined)
      }
      item.push(item_id)
      item = item.flat(Infinity)
      item = Array.from(new Set(item))
      const result = await this.app.mysql.update('users', {
        items: JSON.stringify(item)
      }, {
        where: {
          id: user.id
        }
      });

      res.endata.su = result.affectedRows;
    } catch (e) {
      res.endata.msg = e.message || e
    }

    return res;
  }

  // token中间件鉴权
  async get_token(account) {
    if (!account) {
      return null;
    }
    const user = await this.app.mysql.select('users', {
      account,
    });
    if (user.length === 0) {
      return null;
    }
    return user[0].token
  }

  async userinfo(account) {
    const res = { endata: { su: 0, msg: '' } }
    try {
      const users = await this.app.mysql.select('users', {
        columns: ['account', 'avaimage', 'point', 'nickname', 'completed', 'answered', 'is_new'],
        orders: [['point', 'desc']]
      })
      const index = users.findIndex(u => u.account === account)
      if (-1 === index) {
        throw Error('user not exist')
      }
      const user = users[index]
      res.endata.su = 1
      res.endata.userdata = {
        account: user.account,
        avatarimg: user.avaimage,
        integral: user.point,
        nickname: user.nickname,
        completed: user.completed === 0 ? false : true,
        rank: index + 1,
        answered: user.answered,
        is_new: user.is_new
      }
    } catch (e) {
      re.endata.msg = e.message || e
    }
    return res;
  }

  async get_items(account) {
    const res = { endata: { su: 0, msg: '' } }
    try {
      const user = await this.app.mysql.get('users', {
        account
      })
      if (!user) {
        throw Error('user not exist')
      }
      res.endata.su = 1
      res.endata.items = JSON.parse(user.items) || []
    } catch (e) {
      res.endata.msg = e.message || e
    }
    return res;
  }

  async rank(account) {
    const res = { endata: { su: 0, msg: '' } }
    try {
      const users = await this.app.mysql.select('users', {
        columns: ['account', 'avaimage', 'point', 'nickname'],
        orders: [['point', 'desc']]
      })
      const index = users.findIndex(u => u.account === account)
      if (-1 === index) {
        throw Error('user not exist')
      }
      res.endata.su = 1
      res.endata.rankdata = users.slice(0, 100).map((u, idx) => ({
        account: u.account,
        avatarimg: u.avaimage,
        integral: u.point,
        nickname: u.nickname,
        rank: idx + 1
      }))
      res.endata.my = [users[index]].map(u => ({
        account: u.account,
        avatarimg: u.avaimage,
        integral: u.point,
        nickname: u.nickname,
        rank: index + 1
      }))[0]
    } catch (e) {
      re.endata.msg = e.message || e
    }
    return res;
  }

  async remove_item(account, item_id) {
    const res = {
      endata: {
        su: 0,
        msg: ''
      }
    }

    try {
      const user = await this.app.mysql.get('users', {
        account
      });
      if (!user) {
        throw new Error('用户不存在');
      }

      let item = JSON.parse(user.items) || [];
      if (!item_id) {
        return res
      }
      if (Array.isArray(item_id)) {
        item_id = item_id.filter(v => v !== null && v !== undefined)
      } else {
        item_id = [item_id]
      }
      item_id.forEach(v => {
        const index = item.indexOf(v)
        if (index > -1) {
          item.splice(index, 1)
        }
      })
      const result = await this.app.mysql.update('users', {
        items: JSON.stringify(item)
      }, {
        where: {
          id: user.id
        }
      });

      res.endata.su = result.affectedRows;
    } catch (e) {
      res.endata.msg = e.message || e
    }
    return res;
  }

  async complete_status(account, complete) {
    const res = { endata: { su: 0, msg: '' } }
    complete = (complete === undefined || complete === null) ? true : complete
    try {
      const user = await this.app.mysql.get('users', {
        account
      });
      if (!user) {
        throw new Error('用户不存在');
      }
      const result = await this.app.mysql.update('users', {
        completed: complete ? 1 : 0
      }, {
        where: {
          id: user.id
        }
      })
      res.endata.su = result.affectedRows;
    } catch (e) {
      re.endata.msg = e.message || e
    }
    return res
  }

  async add_answered(account, question) {
    const res = { endata: { su: 0, msg: '' } }
    try {
      const user = await this.app.mysql.get('users', {
        account
      });
      if (!user) {
        throw new Error('用户不存在');
      }

      let answered = Number(question)
      const result = await this.app.mysql.update('users', {
        answered
      }, {
        where: {
          id: user.id
        }
      });

      res.endata.su = result.affectedRows;
    } catch (e) {
      re.endata.msg = e.message || e
    }
    return res
  }
}

module.exports = UserService;
