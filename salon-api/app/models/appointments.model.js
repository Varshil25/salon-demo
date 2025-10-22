module.exports = (sequelize, Sequelize) => {
    const Appointment = sequelize.define("Appointment", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        UserId: { // Foreign key for User ID
            type: Sequelize.INTEGER,
            references: {
                model: require("./user.model")(sequelize, Sequelize),
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            },
            allowNull: true
        },
        BarberId: { // Foreign key for Barber ID
            type: Sequelize.INTEGER,
            references: {
                model: require("./barber.model")(sequelize, Sequelize),
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            },
            allowNull: true
        },
        SalonId: { // Foreign key for Salon ID
            type: Sequelize.INTEGER,
            references: {
                model: require("./salon.model")(sequelize, Sequelize),
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            },
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
        in_salon_time: {  // New field
            type: Sequelize.DATE,
            allowNull: true
        },
        complete_time: {
            type: Sequelize.DATE,
            allowNull: true
        },
        cancel_time: {
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
        }
    });

    // Define relationships with onUpdate and onDelete options
    const Barber = require("./barber.model")(sequelize, Sequelize);
    Appointment.belongsTo(Barber, { 
        foreignKey: 'BarberId', 
        as: 'Barber',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });

    const Salon = require("./salon.model")(sequelize, Sequelize);
    // Appointment.belongsTo(Salon, { foreignKey: 'SalonId', as: 'Salon' });
    Appointment.belongsTo(Salon, { 
        foreignKey: 'SalonId', 
        as: 'salon',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });

    const User = require("./user.model")(sequelize, Sequelize);
    Appointment.belongsTo(User, { 
        foreignKey: 'UserId', 
        as: 'User',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });

    const Service = require("./service.model")(sequelize, Sequelize);
    Appointment.belongsToMany(Service, { 
        through: 'AppointmentServices', 
        foreignKey: 'AppointmentId', 
        otherKey: 'ServiceId' 
    });

    
    //Appointment.belongsToMany(Service, { through: 'AppointmentServices' });

    //Appointment.hasMany(Service); // If a service is linked directly to an appointment

    return Appointment;
};
