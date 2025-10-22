module.exports = (sequelize, Sequelize) => {
    const AppointmentService = sequelize.define("AppointmentService", {
        AppointmentId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Appointments', // Table name
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            },
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        ServiceId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Services', // Table name
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            },
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    });

    return AppointmentService;
};
