'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Barbers');

    if (!tableDescription.start_time) {
      await queryInterface.addColumn('Barbers', 'start_time', {
        type: Sequelize.TIME,
        allowNull: true
      });
    }

    if (!tableDescription.end_time) {
      await queryInterface.addColumn('Barbers', 'end_time', {
        type: Sequelize.TIME,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Barbers');

    if (tableDescription.start_time) {
      await queryInterface.removeColumn('Barbers', 'start_time');
    }

    if (tableDescription.end_time) {
      await queryInterface.removeColumn('Barbers', 'end_time');
    }
  }
};
