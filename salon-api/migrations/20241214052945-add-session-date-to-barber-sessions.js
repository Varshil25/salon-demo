'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('BarberSessions', 'session_date', {
            type: Sequelize.DATE,
            allowNull: true, // Allow NULL temporarily
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('BarberSessions', 'session_date');
    }
};
