const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = async function (migration) {
    try {
        // Ensure migration is a string before replacing
        if (typeof migration !== "string") {
            migration = JSON.stringify(migration);
        }

        // Clean up markdown code blocks
        migration = migration.replace(/```json|```/g, '').trim();
        
        
        // First try to parse the JSON normally
        try {
            migration = JSON.parse(migration);
        } catch (parseError) {
            console.error("JSON parse error:", parseError.message);
            
            if (typeof migration !== "string") {
                throw new Error("Invalid migration format");
            }

            // If standard parsing fails, try to extract the data using regex
            const codeRegex = /"code"\s*:\s*"([\s\S]*?)"\s*,\s*"migration_name"/;
            const nameRegex = /"migration_name"\s*:\s*"([^"]+)"/;
            
            const codeMatch = migration.match(codeRegex);
            const nameMatch = migration.match(nameRegex);
            
            if (!codeMatch || !nameMatch) {
                throw new Error("Failed to extract migration data: " + parseError.message);
            }
            
            // Manually create the migration object
            migration = {
                code: codeMatch[1]
                    .replace(/\\n/g, '\n')
                    .replace(/\\r/g, '\r')
                    .replace(/\\t/g, '\t')
                    .replace(/\\"/g, '"')
                    .replace(/\\\\/g, '\\'),
                migration_name: nameMatch[1]
            };
        }
        
        // Validate the migration object
        if (typeof migration !== "object"  || !migration.code || !migration.migration_name) {
            throw new Error("Invalid migration: Missing required fields");
        }

        // Create migration command
        const migrationCommand = `npx sequelize-cli migration:generate --name ${migration.migration_name}`;

        // Execute migration command
        return new Promise((resolve, reject) => {
            exec(migrationCommand, (err, stdout, stderr) => {
                if (err) {
                    console.error(`❌ Migration generation failed: ${stderr}`);
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
                    reject({ error: "Could not find the newly created migration file" });
                    return;
                }
                
                const migrationFilePath = path.join(migrationDir, mostRecentFile);
                
                // Write the migration code to the file
                try {
                    fs.writeFileSync(migrationFilePath, migration.code);
                    console.log(`✅ Migration code written to ${migrationFilePath}`);
                    
                    // Run migrations
                    exec("npx sequelize-cli db:migrate", (err, stdout, stderr) => {
                        if (err) {
                            console.error(`❌ Migration execution failed: ${stderr}`);
                            reject({ error: "Migration execution failed", details: stderr });
                            return;
                        }
                        console.log(stdout);
                        resolve({ message: "Migration executed successfully", output: stdout });
                    });
                } catch (writeError) {
                    console.error(`❌ Error writing migration file: ${writeError.message}`);
                    reject({ error: "Failed to write migration file", details: writeError.message });
                }
            });
        });
    } catch (error) {
        console.error(`❌ Migration processing error: ${error.message}`);
        return Promise.reject({ error: "Migration processing failed", details: error.message });
    }
}