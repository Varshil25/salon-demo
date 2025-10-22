'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Barbers', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            availability_status: {
                type: Sequelize.ENUM('available', 'unavailable', 'running'),
                allowNull: false
            },
            default_service_time: {
                type: Sequelize.INTEGER,
                allowNull: true // Allows null values
            },
            cutting_since: {
                type: Sequelize.DATE,
                allowNull: true
            },
            organization_join_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            photo: {
                type: Sequelize.STRING,
                allowNull: true
            },
            salonId: { // Adding foreign key reference
                type: Sequelize.INTEGER,
                references: {
                    model: 'Salons', // Name of the target model
                    key: 'id' // Key in the target model
                },
                onDelete: 'CASCADE', // Handle deletion behavior
                allowNull: false // Foreign key cannot be null
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Barbers');
    }
};
