'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      log.belongsTo(models.user, {
        foreignKey: 'userid',
        constraints: false,
        as:"userafected"
      });
    }
  }
  log.init({
    adminid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    logType: DataTypes.STRING,
    action: DataTypes.STRING,
    points: DataTypes.STRING,
    eventdate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'log',
    timestamps: false,
  });
  return log;
};