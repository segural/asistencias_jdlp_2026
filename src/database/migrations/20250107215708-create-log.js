'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      adminid: {
        type: Sequelize.INTEGER
      },
      userid: {
        type: Sequelize.INTEGER
      },
      logType: {
        type: Sequelize.STRING
      },
      action: {
        type: Sequelize.STRING
      },
      points: {
        type: Sequelize.STRING
      },
      eventdate: {
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('logs');
  }
};