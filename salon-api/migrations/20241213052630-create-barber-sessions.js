module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('BarberSessions', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          BarberId: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'Barbers', // Refers to the Barbers table
                  key: 'id',
                  deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
              allowNull: false
          },
          start_time: {
              type: Sequelize.TIME,
              allowNull: false
          },
          end_time: {
              type: Sequelize.TIME,
              allowNull: false
          },
          remaining_time: {
              type: Sequelize.INTEGER, // Time in minutes
              allowNull: false
          },
          created_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW
          },
          updated_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW
          }
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('BarberSessions');
  }
};
