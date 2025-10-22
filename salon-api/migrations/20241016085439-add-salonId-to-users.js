'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'SalonId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Salons', // Ensure this matches the table name for the Salons model
        key: 'id',
        onDelete: 'CASCADE', // Optional: defines what happens when the referenced salon is deleted
      },
      allowNull: true, // Set to true or false depending on your requirement
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'SalonId');
  }
};
