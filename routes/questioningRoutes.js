const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const agents = require('../base-agents');

router.post('/ask', async (req, res) => {
    try {
        const userQuery = req.body.query;

        const message = `
            Here is user response: ${userQuery}.
            Now you need to extract username, password, database, host, port, and dialect (mysql, postgres, etc., default: postgres) in JSON format.
            Give response in just plain json format
            ex.:
            {
                username,
                password,
                database,
                host,
                port,
                dialect
            }
        `;
        const response = await agents.generalAgent(message);
        const cleanResponse = response.replace(/```json|```/g, '').trim();

        const { username, password, database, host, dialect, port } = JSON.parse(cleanResponse);

        // Path to .env file
        const envPath = path.resolve(".env");
        
        // Check if .env file exists
        let existingEnvContent = "";
        if (fs.existsSync(envPath)) {
            existingEnvContent = fs.readFileSync(envPath, { encoding: "utf8" });
        }

        // Create new database credentials content
        const dbCredentials = `
# Database Credentials
DB_USERNAME=${username}
DB_PASSWORD=${password || ''}
DB_DATABASE=${database}
DB_HOST=${host}
DB_DIALECT=${dialect}
DB_PORT=${port || ''}
`;

        // Check if these variables already exist in the file
        const envLines = existingEnvContent.split('\n');
        const dbVars = ['DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE', 'DB_HOST', 'DB_DIALECT', 'DB_PORT'];
        
        // Remove existing database variables if they exist
        const filteredEnvLines = envLines.filter(line => {
            const varName = line.split('=')[0];
            return !dbVars.includes(varName);
        });
        
        // Combine filtered content with new database credentials
        const newEnvContent = filteredEnvLines.join('\n').trim() + 
            (filteredEnvLines.length > 0 ? '\n\n' : '') + 
            dbCredentials;

        // Write to .env file
        fs.writeFileSync(envPath, newEnvContent, { encoding: "utf8" });

        res.status(200).send({ 
            message: "Database credentials saved successfully!", 
            credentials: { username, database, host, dialect, port } 
        });
    } catch (error) {
        console.error("Error saving database credentials:", error);
        res.status(500).send({ 
            error: "Failed to save database credentials", 
            details: error.message 
        });
    }
});

module.exports = router;