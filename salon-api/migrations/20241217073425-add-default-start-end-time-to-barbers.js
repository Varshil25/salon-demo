'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding the 'default_start_time' and 'default_end_time' columns to the 'Barbers' table
    await queryInterface.addColumn('Barbers', 'default_start_time', {
      type: Sequelize.TIME, // TIME type for storing time values (HH:MM:SS)
      allowNull: true,       // Make it nullable if you don't want to enforce a value
    });

    await queryInterface.addColumn('Barbers', 'default_end_time', {
      type: Sequelize.TIME, // TIME type for storing time values (HH:MM:SS)
      allowNull: true,       // Make it nullable if you don't want to enforce a value
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverting the addition of the 'default_start_time' and 'default_end_time' columns
    await queryInterface.removeColumn('Barbers', 'default_start_time');
    await queryInterface.removeColumn('Barbers', 'default_end_time');
  }
};
