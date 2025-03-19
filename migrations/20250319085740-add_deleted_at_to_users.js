module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'deletedAt', {
      allowNull: true,
      type: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'deletedAt');
  }
};