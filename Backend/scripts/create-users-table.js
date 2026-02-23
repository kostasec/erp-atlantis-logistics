const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

async function createUsersTable() {
  try {
    const pool = await sql.connect({
      server: '(localdb)\\MSSQLLocalDB',
      database: 'AtlantisIS',
      options: {
        trustedConnection: true,
        trustServerCertificate: true
      }
    });
    
    const createTableQuery = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
    CREATE TABLE Users (
      UserID INT IDENTITY(1,1) PRIMARY KEY,
      Email NVARCHAR(255) UNIQUE NOT NULL,
      PasswordHash NVARCHAR(255) NOT NULL,
      FirstName NVARCHAR(100) NOT NULL,
      LastName NVARCHAR(100) NOT NULL,
      Role NVARCHAR(50) DEFAULT 'employee' CHECK (Role IN ('admin', 'manager', 'employee')),
      IsActive BIT DEFAULT 1,
      CreatedAt DATETIME2 DEFAULT GETDATE(),
      LastLoginAt DATETIME2 NULL
    );
    `;
    
    await pool.request().query(createTableQuery);
    console.log('Users table created successfully');
    
    // Create default admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('noviPassword123', 12);
    
    const insertAdminQuery = `
    IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'admin@atlantis.rs')
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, Role)
    VALUES ('admin@atlantis.rs', @password, 'Admin', 'User', 'admin');
    `;
    
    await pool.request()
      .input('password', sql.NVarChar, hashedPassword)
      .query(insertAdminQuery);
    
    console.log('Default admin user created (admin@atlantis.rs / noviPassword123)');
    
    await pool.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createUsersTable();