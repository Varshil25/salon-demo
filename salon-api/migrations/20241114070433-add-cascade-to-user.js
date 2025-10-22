module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding ON DELETE CASCADE to the 'RoleId' foreign key in 'Users' table
    await queryInterface.changeColumn('Users', 'RoleId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Roles',  // Reference the 'Roles' table
        key: 'id'
      },
      onDelete: 'CASCADE',  // Ensuring that when a Role is deleted, all users with that Role are also deleted
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverting the changes made in the 'up' method
    await queryInterface.changeColumn('Users', 'RoleId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Roles',
        key: 'id'
      },
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    });
  }
};
