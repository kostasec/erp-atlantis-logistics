const { getPool } = require('../util/db');

async function checkStructure() {
  try {
    const pool = await getPool();
    
    // Get table structure
    const result = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'EmployeeCar'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('EmployeeCar table structure:');
    console.log(result.recordset);
    
    // Get some sample data
    const dataResult = await pool.request().query(`
      SELECT TOP 3 * FROM EmployeeCar
    `);
    
    console.log('\nSample data:');
    console.log(dataResult.recordset);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkStructure();
