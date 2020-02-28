const {Sequelize, DataTypes } = require('sequelize');

// Option 1: Passing parameters separately
sequelize = new Sequelize('splitter', 'root', 'toor', {
    host: 'localhost',
    dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

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

// const getUsers = async (req, res, next) => {
//     console.log('inside get users');
//     try {
//         let users = await User.findAll({});
//         console.log("users" + users);
//         if (users.length > 0) {
//             return res.status(200).json({
//                 'message': 'users fetched successfully',
//                 'data': users
//             });
//         }
//         return res.status(404).json({
//             'code': 'BAD_REQUEST_ERROR',
//             'description': 'No users found in the system'
//         });
//     } catch (error) {
//         return res.status(500).json({
//             'code': 'SERVER_ERROR',
//             'description': 'something went wrong, Please try again'
//         });
//     }
// };
var result = User.findAll();
result.then((resolve) =>console.log(resolve));

debugger;
console.log( result);

// console.log(getUsers());

