const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../configs/db');

const sequelize = new Sequelize(db.database, db.user, db.password, {
    host: db.host,
    dialect: 'mysql'
});

module.exports = {sequelize:sequelize, DataTypes:DataTypes};