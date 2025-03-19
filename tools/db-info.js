const { Sequelize } = require('sequelize');
const config = require('../config/config'); // Adjust the path if needed

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
});

async function getTablesAndColumns() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);

    let data = { tables: tables.map(t => t.table_name) }; // Initialize data object

    for (const table of tables) {
      const [columns] = await sequelize.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${table.table_name}';
      `);
      console.log(`Table: ${table.table_name}`);
      console.table(columns);
      
      data[table.table_name] = columns; // Store columns correctly
    }

    return data;
  } catch (error) {
    console.error('Error fetching table info:', error);
    return null;
  } finally {
    await sequelize.close();
  }
}

module.exports = getTablesAndColumns;
