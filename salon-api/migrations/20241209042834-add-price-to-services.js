'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Services', 'price', {
            type: Sequelize.FLOAT,
            allowNull: false, // You can set it to true if you want to allow null
            defaultValue: 0.0, // Set a default value if required
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Services', 'price');
    },
};
