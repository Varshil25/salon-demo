'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('HaircutDetails', 'appointment_id', 'AppointmentId');
    await queryInterface.renameColumn('HaircutDetails', 'userId', 'UserId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('HaircutDetails', 'AppointmentId', 'appointment_id');
    await queryInterface.renameColumn('HaircutDetails', 'UserId', 'userId');
  }
};
