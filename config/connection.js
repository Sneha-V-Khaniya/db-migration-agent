const { Sequelize } = require('sequelize');

module.exports = function createConnection(dbConfig) {
    return new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port,
    });
}