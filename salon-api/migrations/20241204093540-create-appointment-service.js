module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('AppointmentServices', {
          AppointmentId: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'Appointments', // Table name
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
              allowNull: false
          },
          ServiceId: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'Services', // Table name
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
              allowNull: false
          },
          createdAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updatedAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('AppointmentServices');
  }
};
