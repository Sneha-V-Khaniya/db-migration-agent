const { Sequelize } = require("sequelize");
const config = require("../config/config.json");

// Get environment (default to development)
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

// Initialize Sequelize instance for CockroachDB
const sequelize = new Sequelize({
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  port: 26257, // CockroachDB default port
  dialect: "postgres",
  logging: false, // Set true for debugging
});

module.exports = sequelize;
