'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Days', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      type: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      sede: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      pointsAsigned: {
        type: Sequelize.INTEGER
      },
      active: {
        type: Sequelize.BOOLEAN
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Days');
  }
};