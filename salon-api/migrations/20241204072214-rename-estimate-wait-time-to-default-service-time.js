'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Services', 'estimate_wait_time', 'default_service_time');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Services', 'default_service_time', 'estimate_wait_time');
  }
};
