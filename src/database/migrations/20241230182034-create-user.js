'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      nickname: {
        type: Sequelize.STRING
      },
      present: {
        type: Sequelize.INTEGER
      },
      absent: {
        type: Sequelize.INTEGER
      },
      pres_thursday: {
        type: Sequelize.INTEGER
      },
      abs_thursday: {
        type: Sequelize.INTEGER
      },
      pres_birth: {
        type: Sequelize.INTEGER
      },
      abs_birth: {
        type: Sequelize.INTEGER
      },
      pres_special: {
        type: Sequelize.INTEGER
      },
      abs_special: {
        type: Sequelize.INTEGER
      },
      award: {
        type: Sequelize.INTEGER
      },
      penalty: {
        type: Sequelize.INTEGER
      },
      point: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};