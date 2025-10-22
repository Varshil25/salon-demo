module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('AppointmentServices', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true,
          },
          AppointmentId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'Appointments',
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
          },
          ServiceId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'Services',
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
          },
          createdAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
          },
          updatedAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
          },
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('AppointmentServices');
  },
};
