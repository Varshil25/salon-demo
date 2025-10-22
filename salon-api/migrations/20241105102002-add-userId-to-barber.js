'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Barbers', 'userId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Users', // Ensure the correct name of the Users table
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            },
            allowNull: true // Change to false if you want to enforce that every barber must have a user
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Barbers', 'userId');
    }
};
