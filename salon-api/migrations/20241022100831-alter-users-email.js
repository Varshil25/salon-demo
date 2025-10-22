'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Alter the 'email' column to be NOT NULL and UNIQUE
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the 'email' column changes if needed
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: false,
    });
  }
};
