/********
* index.js file (inside routes/apis)
********/
const express = require('express');
const ApiVersionController = require('./v1');
let router = express.Router();
router.use('/v1', ApiVersionController);
module.exports = router;