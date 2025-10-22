'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, add salonId with a default value for existing rows
    await queryInterface.addColumn('Barbers', 'salonId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Temporarily allow null for existing rows
      references: {
        model: 'Salons',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Update existing rows with a default salonId (choose a valid salonId here)
    await queryInterface.sequelize.query(`
      UPDATE Barbers SET salonId = (SELECT id FROM Salons LIMIT 1) WHERE salonId IS NULL
    `);

    // Make salonId non-nullable after assigning default values
    await queryInterface.changeColumn('Barbers', 'salonId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Salons',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Barbers', 'salonId');
  }
};
