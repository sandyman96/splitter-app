/*
this file defines the server configuration.
1.define 3 constfor express, body-parer and sequelize
2.export this app.js file as an anonymous function.
3.define create and start 
*/
const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const expressHandlebars = require('express-handlebars');
const passport = require('passport');

module.exports = function () {
    let server = express(),
        create,
        start;

    create = (config) => {
        let routes = require('../routes'); //routes/index.js
        // set all the server things
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);

        // add middleware to parse the json
        server.use(passport.initialize() );  /////////////////////////////////////////////
        server.use(bodyParser.json());
        server.use(cookieParser());
        server.use(bodyParser.urlencoded({
            extended: false
        }));

        routes.init(server);
    };
    start = () => {
        let hostname = server.get('hostname'),
            port = server.get('port');
        server.listen(port, function (err) {
            if(err){
                throw err;
            }
            console.log('Express server listening on - http://' + hostname + ':' + port);
        });
    };
    return {
        create: create,
        start: start
    };
};
