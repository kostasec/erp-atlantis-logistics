const { getPool } = require('./util/db');

async function checkAdmin() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT Email, FirstName, LastName, Role, CreatedAt 
      FROM Users 
      WHERE Role = 'admin' OR Email LIKE '%admin%'
    `);
    
    console.log('Admin users found:');
    console.table(result.recordset);
    
    if (result.recordset.length === 0) {
      console.log('No admin users found. Creating default admin...');
      
      const bcrypt = require('bcryptjs');
      const defaultPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 12);
      
      await pool.request()
        .input('Email', 'admin@atlantis.rs')
        .input('PasswordHash', hashedPassword)
        .input('FirstName', 'Admin')
        .input('LastName', 'User')
        .input('Role', 'admin')
        .query(`
          INSERT INTO Users (Email, PasswordHash, FirstName, LastName, Role, IsActive, CreatedAt)
          VALUES (@Email, @PasswordHash, @FirstName, @LastName, @Role, 1, GETDATE())
        `);
      
      console.log('Default admin created with credentials:');
      console.log('Email: admin@atlantis.rs');
      console.log('Password: admin123');
    }
    
  } catch (err) {
    console.error('Database error:', err.message);
  }
}

checkAdmin();