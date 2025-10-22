'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Salons', 'google_url', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Salons', 'status', {
      type: Sequelize.ENUM('open', 'close'),
      allowNull: false,
      defaultValue: 'close'
    });

    await queryInterface.addColumn('Salons', 'services', {
      type: Sequelize.JSON,
      allowNull: true
    });

    await queryInterface.addColumn('Salons', 'pricing', {
      type: Sequelize.JSON,
      allowNull: true
    });

    await queryInterface.addColumn('Salons', 'faq', {
      type: Sequelize.JSON,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Salons', 'google_url');
    await queryInterface.removeColumn('Salons', 'status');
    await queryInterface.removeColumn('Salons', 'services');
    await queryInterface.removeColumn('Salons', 'pricing');
    await queryInterface.removeColumn('Salons', 'faq');
  }
};
