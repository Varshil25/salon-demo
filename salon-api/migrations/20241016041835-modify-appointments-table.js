'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Appointments', 'user_id', {
            type: Sequelize.STRING,
            allowNull: true // Set user_id to nullable
        });

        await queryInterface.addColumn('Appointments', 'device_id', {
            type: Sequelize.STRING,
            allowNull: true // Add new device_id field, nullable
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert changes in case of rollback
        await queryInterface.changeColumn('Appointments', 'user_id', {
            type: Sequelize.STRING,
            allowNull: false // Rollback to previous state
        });

        await queryInterface.removeColumn('Appointments', 'device_id');
    }
};
