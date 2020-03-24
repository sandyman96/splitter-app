const server = require('./app/configs/app')();
const SERVER_CONFIG = require('./app/configs/config/config');
// const DB = require('./app/configs/db');

server.create(SERVER_CONFIG);
server.start();