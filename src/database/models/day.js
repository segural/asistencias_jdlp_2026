'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Day extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Day.belongsToMany(models.user, {
        as: "presents",
        through: "day_user",
        foreignKey: "day_id",
        otherKey: "user_id",
        timestamps: false,
      });
    }
  }
  Day.init({
    date: DataTypes.DATE,
    type: DataTypes.STRING,
    photo: {type:DataTypes.STRING, allowNull: true},
    sede: DataTypes.STRING,
    description: {type:DataTypes.STRING, allowNull: true},
    pointsAsigned: {type:DataTypes.INTEGER, allowNull: true},
    active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'day',
    timestamps: false,
  });
  return Day;
};