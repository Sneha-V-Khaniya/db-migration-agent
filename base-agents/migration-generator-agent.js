const gemini = require('../llms/gemini');
const getTablesAndColumns = require('../tools/db-info');

module.exports = async function migrationGeneratorAgent({query, isFromImage = false, image, mimeType}) {
    let dbInfo;

    try {
        dbInfo = await getTablesAndColumns();
        if (!dbInfo) {
            console.error("Failed to fetch database information.");
            return { error: "Could not retrieve database schema." };
        }
        console.log("log::", dbInfo);
    } catch (err) {
        console.error("Error fetching database info:", err);
        return { error: "Database information retrieval failed." };
    }

    const message = `
        Hey Query: ${JSON.stringify(query, null, 2)}.
        ${isFromImage ? "Generate migrations for all tables. Ensure that base/simple tables are created first and then create tables having foreign keys. " : "Here is the database existing tables' information: ${JSON.stringify(dbInfo, null, 2)}\
        If you're inserting, deleting, or updating data, refer to that database information and then generate migration by referring tables columns. "}
        You need to generate Sequelize migrations from that. Generate multiple migrations if needed.
        Just give me the code and an appropriate migration name **without** a timestamp and **without** the .js extension.
        Use snake_case for table names if a new table needs to be created.
        
        Respond in **plain JSON format** like:
            [
                {
                    "code": "your_migration_code_here",
                    "migration_name": "your_migration_name_here"
                },
                {
                    "code": "your_another_migration_code_here",
                    "migration_name": "your_another_migration_name_here"
                }
            ]
    `;

    console.log("message::", message);

    try {
        // const response = image ? await gpt.ask({}) : await gemini.ask({prompt: message, image, mimeType});
        const response = await gemini.ask({prompt: message, image, mimeType});

        return response;
        
    } catch (err) {
        console.error("Error calling Gemini API:", err);
        return { error: "Gemini API call failed." };
    }
};
