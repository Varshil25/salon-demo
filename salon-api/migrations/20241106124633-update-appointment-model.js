'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Appointments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Reference the correct table name
          key: 'id'
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      BarberId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Barbers', // Reference the correct table name
          key: 'id'
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      SalonId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Salon', // Reference the correct table name
          key: 'id'
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Appointments');
  }
};

