/********
* user.js file (models)
********/
// const { Sequelize, DataTypes, Model } = require('sequelize');
// const db = require('../configs/db');
// console.log(db.user + db.password + db.host);

// const sequelize = new Sequelize(db.database, db.user, db.password, { 
//     host: 'localhost',
//     dialect: 'mysql' 
// });

const sequelizeConfig = require('./config/config');
const sequelize = sequelizeConfig.sequelize;
const DataTypes = sequelizeConfig.DataTypes;

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    UserName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    UserEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    UserPhoneNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    UserPassword: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'UserList',
    timestamps: false
});
module.exports = User;
