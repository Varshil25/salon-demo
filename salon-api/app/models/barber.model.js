module.exports = (sequelize, Sequelize) => {
    const Barber = sequelize.define("Barber", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        availability_status: {
            type: Sequelize.ENUM('available', 'unavailable', 'running'),
            allowNull: false
        },
        default_service_time: {
            type: Sequelize.INTEGER, // time in minutes
            allowNull: true
        },
        cutting_since: {
            type: Sequelize.DATE,
            allowNull: true
        },
        organization_join_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        photo: {
            type: Sequelize.STRING,
            allowNull: true
        }, 
        background_color: { // New field name
            type: Sequelize.STRING, // Hex or descriptive color value
            allowNull: true
        },
        default_start_time: {
            type: Sequelize.TIME,
            allowNull: true
        }, 
        default_end_time: {
            type: Sequelize.TIME,
            allowNull: true
        },       
        SalonId: { // Foreign key for Salon ID
            type: Sequelize.INTEGER,
            references: {
                model: require("./salon.model")(sequelize, Sequelize),
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        UserId: { // Foreign key for User ID
            type: Sequelize.INTEGER,
            references: {
                model: require("./user.model")(sequelize, Sequelize),
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    });

    // Define relationships with onUpdate and onDelete options
    const Salon = require("./salon.model")(sequelize, Sequelize);
    const User = require("./user.model")(sequelize, Sequelize);

    Barber.belongsTo(Salon, { 
        foreignKey: 'SalonId', 
        as: 'salon',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });
    Barber.belongsTo(User, { 
        foreignKey: 'UserId', 
        as: 'user',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });

    return Barber;
};
