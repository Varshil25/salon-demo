'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Barbers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            SalonId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Salons', // Ensure this matches the name of your Salons table
                    key: 'id',
                },
                onDelete: 'CASCADE', // Automatically delete barbers if the salon is deleted
                onUpdate: 'CASCADE', // Update salonId in barbers if salon id is updated
                allowNull: false, // Ensure a barber must belong to a salon
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Barbers');
    },
};
