'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Appointments', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            UserId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users', // table name
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: true
            },
            BarberId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Barbers', // table name
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: true
            },
            SalonId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Salons', // table name
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: true
            },
            number_of_people: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('checked_in', 'in_salon', 'completed', 'canceled'),
                allowNull: false
            },
            estimated_wait_time: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            queue_position: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            device_id: {
                type: Sequelize.STRING,
                allowNull: true
            },
            check_in_time: {
                type: Sequelize.DATE,
                allowNull: true
            },
            complete_time: {
                type: Sequelize.DATE,
                allowNull: true
            },
            mobile_number: {
                type: Sequelize.STRING,
                allowNull: true
            },
            name: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('Appointments');
    }
};
