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
        You need to generate a Sequelize migration from that.
        Just give me the code and an appropriate migration name **without** a timestamp and **without** the .js extension.
        Use snake_case for table names if a new table needs to be created.
        Here is the database existing tables' information: ${JSON.stringify(dbInfo, null, 2)}
        If you're inserting, deleting, or updating data, refer to that database information and then generate migration by referring tables columns. 

        Respond in **plain JSON format** like:
        {
            "code": "your_migration_code_here",
            "migration_name": "your_migration_name_here"
        }
    `;

    console.log("message::", message);

    try {
        const response = await gemini.ask(message);
        // return {
        //     "code": "module.exports = {\n  up: async (queryInterface, Sequelize) => {\n    await queryInterface.bulkInsert('planets', [\n      { name: 'Mercury', diameter: 4879, mass: 3.3011e23, orbital_period: 88, rotation_period: 59, gravity: '3.7 m/s²', climate: 'None', terrain: 'Rocky', surface_water: 0, population: 0, createdAt: new Date(), updatedAt: new Date() },\n      { name: 'Venus', diameter: 12104, mass: 4.8675e24, orbital_period: 225, rotation_period: -243, gravity: '8.87 m/s²', climate: 'Hot', terrain: 'Volcanic', surface_water: 0, population: 0, createdAt: new Date(), updatedAt: new Date() },\n      { name: 'Earth', diameter: 12742, mass: 5.97237e24, orbital_period: 365, rotation_period: 1, gravity: '9.81 m/s²', climate: 'Temperate', terrain: 'Varied', surface_water: 71, population: 8000000000, createdAt: new Date(), updatedAt: new Date() },\n      { name: 'Mars', diameter: 6779, mass: 6.4171e23, orbital_period: 687, rotation_period: 1.03, gravity: '3.71 m/s²', climate: 'Cold', terrain: 'Desert', surface_water: 0, population: 0, createdAt: new Date(), updatedAt: new Date() },\n      { name: 'Jupiter', diameter: 139820, mass: 1.8982e27, orbital_period: 4333, rotation_period: 0.41, gravity: '24.79 m/s²', climate: 'Gaseous', terrain: 'Gas Giant', surface_water: 0, population: 0, createdAt: new Date(), updatedAt: new Date() },\n      { name: 'Saturn', diameter: 116460, mass: 5.6834e26, orbital_period: 10759, rotation_period: 0.45, gravity: '10.44 m/s²', climate: 'Gaseous', terrain: 'Gas Giant', surface_water: 0, population: 0, createdAt: new Date(), updatedAt: new Date() },\n      { name: 'Uranus', diameter: 50724, mass: 8.6810e25, orbital_period: 30687, rotation_period: -0.72, gravity: '8.69 m/s²', climate: 'Cold', terrain: 'Ice Giant', surface_water: 0, population: 0, createdAt: new Date(), updatedAt: new Date() },\n      { name: 'Neptune', diameter: 49244, mass: 1.02413e26, orbital_period: 60190, rotation_period: 0.67, gravity: '11.15 m/s²', climate: 'Cold', terrain: 'Ice Giant', surface_water: 0, population: 0, createdAt: new Date(), updatedAt: new Date() }\n    ], {});\n  },\n  down: async (queryInterface, Sequelize) => {\n    await queryInterface.bulkDelete('planets', null, {});\n  }\n};",
        //     "migration_name": "insert_solar_system_planets"
        // }

        return response;
        ;
    } catch (err) {
        console.error("Error calling Gemini API:", err);
        return { error: "Gemini API call failed." };
    }
};
