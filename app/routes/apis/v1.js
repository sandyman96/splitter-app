/********
* v1.js file (inside routes/apis)
********/
const Controller = require('../../controllers/controller'); //router with .get .post etc
const expressRouter = require('express')();

expressRouter.use('', Controller);
module.exports = expressRouter;
