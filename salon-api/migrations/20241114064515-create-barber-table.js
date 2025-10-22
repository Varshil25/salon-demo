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
                allowNull: true
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
            SalonId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Salons', // table name
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            UserId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users', // table name
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
        await queryInterface.dropTable('Barbers');
    }
};
