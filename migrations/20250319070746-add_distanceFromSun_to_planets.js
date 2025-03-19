module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('planets', 'distanceFromSun', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('planets', 'distanceFromSun');
  }
};