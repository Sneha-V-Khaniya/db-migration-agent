const agents = require('../base-agents');
const executeMigration = require('../tools/execute-migration');

module.exports = async function ({query, image, mimeType}) {
    let migration, response;

    try {
        // Generate migration
        migration = await agents.migrationGeneratorAgent({ query, image, mimeType});

        // Execute migration
        response = await executeMigration(migration);

        return response;
    } catch (err) {
        console.error(err);
        console.log("Error from generate and execute migration.");

        // Ensure migration is defined before using it in reQuery
        const migrationText = migration ? JSON.stringify(migration, null, 2) : "undefined";

        const reQuery = `
            Hey, this migration: 
            ${migrationText}
            failed with error:
            ${err.message}
            for query: ${query}

            Can you take appropriate action?
        `;

        // Retry by calling the function again
        // response = await module.exports(reQuery);

        // console.log("res::", response);

        throw err ;
    }

    // return response;
};
