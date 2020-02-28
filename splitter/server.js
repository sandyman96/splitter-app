const server = require('./app/configs/app')();
const SERVER_CONFIG = require('./app/configs/config/config');
const DB = require('./app/configs/db');

//create the basic server setup 
server.create(SERVER_CONFIG, DB);

//start the server
server.start();