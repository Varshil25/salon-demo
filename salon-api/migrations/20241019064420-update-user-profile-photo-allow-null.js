'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'profile_photo', {
      type: Sequelize.STRING,
      allowNull: true // Update to allow null values
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'profile_photo', {
      type: Sequelize.STRING,
      allowNull: false // Revert to not allowing null values if needed
    });
  }
};
