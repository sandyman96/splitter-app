const expressRouter = require('express')();
const userController = require('./apis/userController');

expressRouter.use( '/users',userController);
module.exports = expressRouter;