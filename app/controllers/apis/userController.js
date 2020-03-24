/********
* user.js file (controllers/apis)
********/
const userService = require('../../services/users/userService');
const expressRouter = require('express')();
const passportauth = require('../../services/Authentication/passportauth');

expressRouter.get('/', passportauth.authJwt, userService.getUsers);
expressRouter.post('/register', userService.createUsers);
expressRouter.post('/login', userService.userLogin);
expressRouter.get('/logout', userService.userLogout);
expressRouter.get('/reset', userService.resetEligibilityCheck);
expressRouter.post('/newPassword', userService.setNewPassword)

module.exports = expressRouter;
/********
* user.js file (controllers/apis)
********/
