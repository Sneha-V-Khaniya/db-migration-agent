const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = async function (migrations) {
    try {
        // Ensure migrations are a string before replacing
        if (typeof migrations !== "string") {
            migrations = JSON.stringify(migrations);
        }

        // Clean up markdown code blocks
        migrations = migrations.replace(/```json|```/g, '').trim();

        // Parse the JSON
        let migrationsArray;
        try {
            migrationsArray = JSON.parse(migrations);
        } catch (parseError) {
            console.error("JSON parse error:", parseError.message);
            throw new Error("Invalid migrations format");
        }

        // Validate that migrations is an array
        if (!Array.isArray(migrationsArray)) {
            throw new Error("Migrations must be provided as an array");
        }

        // Process each migration
        for (const migration of migrationsArray) {
            // Validate the migration object
            if (typeof migration !== "object" || !migration.code || !migration.migration_name) {
                console.error(`Invalid migration: Missing required fields in ${JSON.stringify(migration)}`);
                continue; // Skip invalid migrations
            }

            // Create migration command
            const migrationCommand = `npx sequelize-cli migration:generate --name ${migration.migration_name}`;

            // Execute migration command
            await new Promise((resolve, reject) => {
                exec(migrationCommand, (err, stdout, stderr) => {
                    if (err) {
                        console.error(`❌ Migration generation failed for ${migration.migration_name}: ${stderr}`);
                        reject({ error: "Migration failed", details: stderr });
                        return;
                    }
                    console.log(stdout);

                    // Find the newly created migration file
                    const migrationDir = path.resolve('./migrations');

                    if (!fs.existsSync(migrationDir)) {
                        reject({ error: "Migration directory not found" });
                        return;
                    }

                    const migrationFiles = fs.readdirSync(migrationDir);

                    // Sort by creation time to get the most recent one
                    const mostRecentFile = migrationFiles
                        .filter(file => file.includes(migration.migration_name))
                        .sort((a, b) => {
                            return fs.statSync(path.join(migrationDir, b)).birthtime -
                                fs.statSync(path.join(migrationDir, a)).birthtime;
                        })[0];

                    if (!mostRecentFile) {
                        reject({ error: `Could not find the newly created migration file for ${migration.migration_name}` });
                        return;
                    }

                    const migrationFilePath = path.join(migrationDir, mostRecentFile);

                    // Write the migration code to the file
                    try {
                        fs.writeFileSync(migrationFilePath, migration.code);
                        console.log(`✅ Migration code written to ${migrationFilePath}`);
                        resolve();
                    } catch (writeError) {
                        console.error(`❌ Error writing migration file for ${migration.migration_name}: ${writeError.message}`);
                        reject({ error: "Failed to write migration file", details: writeError.message });
                    }
                });
            });

            // Run migrations for the current file
            await new Promise((resolve, reject) => {
                exec("npx sequelize-cli db:migrate", (err, stdout, stderr) => {
                    if (err) {
                        console.error(`❌ Migration execution failed for ${migration.migration_name}: ${stderr}`);
                        reject({ error: "Migration execution failed", details: stderr });
                        return;
                    }
                    console.log(stdout);
                    resolve({ message: "Migration executed successfully", output: stdout });
                });
            });
        }

        return { message: "All migrations executed successfully" };
    } catch (error) {
        console.error(`❌ Migration processing error: ${error.message}`);
        return Promise.reject({ error: "Migration processing failed", details: error.message });
    }
};