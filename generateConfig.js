const fs = require("fs");
require("dotenv").config();

const config = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "database_development",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "mysql",
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

// Write to config.json
fs.writeFileSync("config.json", JSON.stringify(config, null, 2), "utf8");

console.log("✅ config.json has been generated!");
