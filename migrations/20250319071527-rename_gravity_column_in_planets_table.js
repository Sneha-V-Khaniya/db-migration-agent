module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('planets', 'gravity', 'gravity_type');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('planets', 'gravity_type', 'gravity');
  }
};