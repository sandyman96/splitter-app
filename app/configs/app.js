/*
this file defines the server configuration.
1.define 3 constfor express, body-parer and sequelize
2.export this app.js file as an anonymous function.
3.define create and start 
*/
const express = require('express');
const bodyParser = require('body-parser');
// const Sequelize = require('sequelize');

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
//         sequelize = new Sequelize(db.database, db.user, db.password, {
//             host: db.host,
//             dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
// });
        // try {
        //     // await sequelize.authenticate();
        //     // sequelize.authenticate();
        //     console.log('Connection has been established successfully.');
        // } catch (error) {
        //     console.error('Unable to connect to the database:', error);
        // }
        // Set up routes
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


// const AppController = require("./app/controller/appController");
// EXPRESS_APPLICATION.use(BODY_PARSER_VAR.json());

// EXPRESS_APPLICATION.listen(PORT, () => {
//     console.log("listening");
// });
// EXPRESS_APPLICATION.post('/api/users/register', function (req, res) {
//     var bodyContents = req.body;
//     var reply = AppController.registerUser(
//         bodyContents["userName"],
//         bodyContents["userEmail"],
//         bodyContents["userPhone"],
//         bodyContents["userPassword"]
//     );
//     res.send(reply);
// });

