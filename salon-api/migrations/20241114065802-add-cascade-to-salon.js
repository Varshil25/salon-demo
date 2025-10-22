'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Salons', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      open_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      close_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      photos: {
        type: Sequelize.JSON,
        allowNull: true
      },
      google_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('open', 'close'),
        allowNull: false,
        defaultValue: 'open'
      },
      services: {
        type: Sequelize.JSON,
        allowNull: true
      },
      pricing: {
        type: Sequelize.JSON,
        allowNull: true
      },
      faq: {
        type: Sequelize.JSON,
        allowNull: true
      },
      weekend_day: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      weekend_start: {
        type: Sequelize.TIME,
        allowNull: true
      },
      weekend_end: {
        type: Sequelize.TIME,
        allowNull: true
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Referencing the Users table
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        },
        onDelete: 'CASCADE',  // Cascade delete
        onUpdate: 'CASCADE'   // Cascade update
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

    // Add the foreign key constraint for the UserId field
    await queryInterface.addConstraint('Salons', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'fk_salon_user', // Custom name for the foreign key
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Additional associations for Barbers and FavoriteSalons will be managed via model relationships
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the table and associated constraints in the down migration
    await queryInterface.removeConstraint('Salons', 'fk_salon_user');
    await queryInterface.dropTable('Salons');
  }
};
