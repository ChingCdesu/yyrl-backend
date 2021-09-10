module.exports = app => {
  const { router, controller } = app;

  router.post('/app/login', controller.user.login);
  router.post('/app/register', controller.user.register);
  router.post('/app/user', controller.user.change);
  router.post('/app/user/updimg', controller.user.change_avatar);
}