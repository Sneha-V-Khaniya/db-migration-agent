module.exports = { 
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('planets', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      diameter: {
        type: Sequelize.INTEGER,
      },
      mass: {
        type: Sequelize.DECIMAL,
      },
      orbital_period: {
        type: Sequelize.INTEGER,
      },
      rotation_period: {
        type: Sequelize.INTEGER,
      },
      gravity: {
        type: Sequelize.STRING,
      },
      climate: {
        type: Sequelize.STRING,
      },
      terrain: {
        type: Sequelize.STRING,
      },
      surface_water: {
        type: Sequelize.INTEGER,
      },
      population: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('planets');
  },
};
