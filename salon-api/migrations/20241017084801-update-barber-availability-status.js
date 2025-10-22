'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change ENUM type for availability_status to include 'running' instead of 'on break'
    await queryInterface.changeColumn('Barbers', 'availability_status', {
      type: Sequelize.ENUM('available', 'unavailable', 'running'),  // New ENUM definition
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert ENUM type back to include 'on break'
    await queryInterface.changeColumn('Barbers', 'availability_status', {
      type: Sequelize.ENUM('available', 'unavailable', 'on break'),  // Old ENUM definition
      allowNull: false
    });
  }
};
