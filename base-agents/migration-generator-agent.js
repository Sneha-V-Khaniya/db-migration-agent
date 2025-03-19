const gemini = require('../llms/gemini');
const getTablesAndColumns = require('../tools/db-info');

module.exports = async function migrationGeneratorAgent(query) {
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
        Hey from user Query: ${query}.
        You need to generate Sequelize migrations from that.
        Just give me the code and an appropriate migration name **without** a timestamp and **without** the .js extension.
        Use snake_case for table names if a new table needs to be created.
        Here is the database existing tables' information: ${JSON.stringify(dbInfo, null, 2)}
        If you're inserting, deleting, or updating data, refer to that database information and then generate migration by referring tables columns. 

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
        const response = await gemini.ask(message);

        return response;
        
    } catch (err) {
        console.error("Error calling Gemini API:", err);
        return { error: "Gemini API call failed." };
    }
};
