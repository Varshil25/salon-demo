'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Appointments', 'check_in_time', {
            type: Sequelize.DATE,
            allowNull: true,
        });
        await queryInterface.addColumn('Appointments', 'complete_time', {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Appointments', 'check_in_time');
        await queryInterface.removeColumn('Appointments', 'complete_time');
    }
};
