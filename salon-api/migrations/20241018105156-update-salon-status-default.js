'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Salons', 'status', {
      type: Sequelize.ENUM('open', 'close'),
      allowNull: false,
      defaultValue: 'open' // Change default to 'open'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Salons', 'status', {
      type: Sequelize.ENUM('open', 'close'),
      allowNull: false,
      defaultValue: 'close' // Revert default back to 'close' in case of rollback
    });
  }
};
