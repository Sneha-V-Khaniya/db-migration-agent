require('dotenv').config();

const express = require("express");
// const sequelize = require("./db/cockroach");
const migrationRoutes = require("./routes/migrationRoutes");
const askRoutes = require("./routes/questioningRoutes");

const app = express();
app.use(express.json());

// Test CockroachDB connection
// sequelize
//   .authenticate()
//   .then(() => console.log("✅ Connected to CockroachDB"))
//   .catch((err) => console.error("❌ CockroachDB connection failed:", err));

// Use migration routes
app.use("/api", migrationRoutes);
app.use("/api", askRoutes);


// Start Server
const PORT = process.env.PORT || 8060;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// const express = require('express');
// const app = express();

// const inquirer = require("inquirer");
// const { Sequelize } = require("sequelize");
// const fs = require("fs");
// const { exec } = require("child_process");

// app.use(express.json());

// let sequelize;

// // Function to prompt for DB credentials
// async function getDBCredentials() {
//     const answers = await inquirer.prompt([
//         { type: "input", name: "host", message: "Enter DB Host:" },
//         { type: "input", name: "port", message: "Enter DB Port:", default: "5432" },
//         { type: "input", name: "database", message: "Enter Database Name:" },
//         { type: "input", name: "username", message: "Enter DB Username:" },
//         { type: "password", name: "password", message: "Enter DB Password:" }
//     ]);

//     sequelize = new Sequelize(answers.database, answers.username, answers.password, {
//         host: answers.host,
//         port: answers.port,
//         dialect: "postgres", // Change to "mysql" if needed
//         logging: false
//     });

//     try {
//         await sequelize.authenticate();
//         console.log("✅ Connected to the database successfully.");
//     } catch (error) {
//         console.error("❌ Failed to connect:", error);
//         process.exit(1);
//     }
// }

// // API to handle user request for DB changes
// app.post("/migrate", async (req, res) => {
//     const { tableName, columns } = req.body;
    
//     if (!tableName || !columns) {
//         return res.status(400).json({ error: "Missing tableName or columns" });
//     }

//     // Generate migration file
//     const migrationName = `create-${tableName}`;
//     const migrationPath = `migrations/${Date.now()}-${migrationName}.js`;

//     let columnDefinitions = "";
//     for (const [colName, colType] of Object.entries(columns)) {
//         columnDefinitions += `\n        ${colName}: { type: Sequelize.${colType.toUpperCase()} },`;
//     }

//     const migrationTemplate = `
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('${tableName}', {
//       id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
//       ${columnDefinitions}
//       createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
//       updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
//     });
//   },
//   async down(queryInterface) {
//     await queryInterface.dropTable('${tableName}');
//   }
// };
// `;

//     fs.writeFileSync(migrationPath, migrationTemplate);
//     console.log(`✅ Migration created: ${migrationPath}`);

//     // Run migration
//     exec("npx sequelize-cli db:migrate", (err, stdout, stderr) => {
//         if (err) {
//             console.error(`❌ Migration failed: ${stderr}`);
//             return res.status(500).json({ error: "Migration failed" });
//         }
//         console.log(stdout);
//         res.json({ message: "Migration executed successfully" });
//     });
// });

// // Start server after getting credentials
// getDBCredentials().then(() => {
//     app.listen(3000, () => console.log("🚀 Server running on port 3000"));
// });
