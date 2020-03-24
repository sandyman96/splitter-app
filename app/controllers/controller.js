const expressRouter = require('express')();
const userController = require('./apis/userController');

expressRouter.use('/users', userController);
expressRouter.use('/home', (req, res, next) => {
  return res.send("home");
})
module.exports = expressRouter;