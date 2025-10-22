'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('HaircutDetails', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            AppointmentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Appointments', // Name of the appointments table
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            UserId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Name of the users table
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            customer_notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            haircut_style: {
                type: Sequelize.STRING,
                allowNull: true
            },
            product_used: {
                type: Sequelize.STRING,
                allowNull: true
            },
            barber_notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('HaircutDetails');
    }
};
