module.exports = () => {
  return async function (ctx, next) {
    if (ctx.request.method.toUpperCase() === 'GET') {
      await next();
      return;
    }
    if (ctx.request.path === '/app/login' || ctx.request.path === '/app/register') {
      await next();
      return;
    }

    const headers = ctx.request.headers;

    const token = headers.token;
    const { account } = ctx.request.body;

    const correct = await ctx.service.user.get_token(account);
    if (!token || !correct || token !== correct) {
      ctx.body = {
        endata: {
          su: 0,
          msg: 'token失效，请重新登录'
        }
      }
      return;
    }

    await next();
    
  }
}
