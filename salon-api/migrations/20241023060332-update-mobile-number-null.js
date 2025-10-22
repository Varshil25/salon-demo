'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'mobile_number', {
      type: Sequelize.STRING,
      allowNull: true // Set to true to allow null values
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'mobile_number', {
      type: Sequelize.STRING,
      allowNull: false // Revert back to not allow null values
    });
  }
};
