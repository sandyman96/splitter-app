/********
* user.js file (models)
********/
// const sequelizeConfig = require('./config/config');
const sequelize = require('./config/config').sequelize;
const DataTypes = require('./config/config').DataTypes;

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
    },
    UserRole: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'UserList',
    timestamps: false
});
module.exports = User;
