/*
this file defines the server configuration.
1.define 3 constfor express, body-parer and sequelize
2.export this app.js file as an anonymous function.
3.define create and start 
*/
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressHandlebars = require('express-handlebars');

module.exports = function () {
    let server = express(),
        create,
        start;
    create = (config, db) => {
        let routes = require('../routes'); //routes/index.js
        // set all the server things
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);
        // add middleware to parse the json
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({
            extended: false
        }));

        routes.init(server);
    };
    start = () => {
        let hostname = server.get('hostname'),
            port = server.get('port');
        server.listen(port, function () {
            console.log('Express server listening on - http://' + hostname + ':' + port);
        });
    };
    return {
        create: create,
        start: start
    };
};
