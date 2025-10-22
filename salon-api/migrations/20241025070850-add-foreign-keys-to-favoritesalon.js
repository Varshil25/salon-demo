'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint('favoriteSalons', {
            fields: ['salonId'],
            type: 'foreign key',
            name: 'fk_favoritesalon_salon', // Custom name for the constraint
            references: {
                table: 'Salons',
                field: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('favoriteSalons', 'fk_favoritesalon_salon');
    },
};
