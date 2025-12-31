'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_2025 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  User_2025.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    nickname: DataTypes.STRING,
    present: DataTypes.INTEGER,
    absent: DataTypes.INTEGER,
    pres_thursday: DataTypes.INTEGER,
    abs_thursday: DataTypes.INTEGER,
    pres_birth: DataTypes.INTEGER,
    abs_birth: DataTypes.INTEGER,
    pres_special: DataTypes.INTEGER,
    abs_special: DataTypes.INTEGER,
    award: DataTypes.INTEGER,
    penalty: DataTypes.INTEGER,
    point: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'user_2025',
    timestamps: false,
  });
  return User_2025;
};