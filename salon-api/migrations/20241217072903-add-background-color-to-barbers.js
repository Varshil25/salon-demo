'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding the 'background_color' column to 'Barbers' table
    await queryInterface.addColumn('Barbers', 'background_color', {
      type: Sequelize.STRING, // You can use STRING for hex values or color names
      allowNull: true,        // Set to false if you want it to be required
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverting the addition of the 'background_color' column
    await queryInterface.removeColumn('Barbers', 'background_color');
  }
};
