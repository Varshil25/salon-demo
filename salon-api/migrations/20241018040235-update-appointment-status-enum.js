'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Appointments', 'status', {
        type: Sequelize.ENUM('checked_in', 'in_salon', 'completed', 'canceled'),
        allowNull: false
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // In case you want to revert the changes
    return Promise.all([
      queryInterface.changeColumn('Appointments', 'status', {
        type: Sequelize.STRING,
        allowNull: false
      })
    ]);
  }
};
