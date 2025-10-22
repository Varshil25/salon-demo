'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add the SalonId column as nullable
    await queryInterface.addColumn('BarberSessions', 'SalonId', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Set it to nullable first
      references: {
        model: 'Salons', // Reference to the Salons table
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Step 2: Update existing records (this step depends on your data)
    // You can set a default value, or update based on existing logic (e.g., assign a specific SalonId to existing records)
    await queryInterface.sequelize.query(
      `UPDATE "BarberSessions" SET "SalonId" = 1 WHERE "SalonId" IS NULL` // Example: Set all NULL SalonId to 1 (or any valid SalonId)
    );

    // Step 3: Alter the column to not allow null values
    await queryInterface.changeColumn('BarberSessions', 'SalonId', {
      type: Sequelize.INTEGER,
      allowNull: false, // Set it to non-nullable
      references: {
        model: 'Salons',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('BarberSessions', 'SalonId');
  }
};
