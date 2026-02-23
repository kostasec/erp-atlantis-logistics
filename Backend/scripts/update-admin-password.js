const sql = require('mssql/msnodesqlv8');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updateAdminPassword() {
  try {
    const pool = await sql.connect({
      server: '(localdb)\\MSSQLLocalDB',
      database: 'AtlantisIS',
      options: {
        trustedConnection: true,
        trustServerCertificate: true
      }
    });
    
    // Novi password
    const newPassword = 'noviPassword123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const updatePasswordQuery = `
    UPDATE Users 
    SET PasswordHash = @password 
    WHERE Email = 'admin@atlantis.rs';
    `;
    
    await pool.request()
      .input('password', sql.NVarChar, hashedPassword)
      .query(updatePasswordQuery);
    
    console.log(`Admin password updated to: ${newPassword}`);
    
    await pool.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateAdminPassword();