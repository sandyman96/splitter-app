const sequelize = require('./config/config').sequelize;
const DataTypes = require('./config/config').DataTypes;

const OTPTable = sequelize.define('OTPTable', {
  id :{
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  OTPBcrypt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tries: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  }
}, {
    tableName: 'OTPTable',
    timestamps: false
});
module.exports = OTPTable;
