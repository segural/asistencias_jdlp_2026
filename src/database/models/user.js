'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.day, {
        as: "days",
        through: "day_user",
        foreignKey: "day_id",
        otherKey: "user_id",
        timestamps: false,
      });
      User.hasMany(models.log, {
        as:'logs',
        foreignKey: 'userid',
        constraints: false,
      })
    }
  }
  User.init({
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
    modelName: 'user',
    timestamps: false,
  });
  return User;
};