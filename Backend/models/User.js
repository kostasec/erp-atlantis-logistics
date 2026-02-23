const { sql, getPool } = require('../util/db');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const pool = await getPool();
    return pool.request()
      .input('Email', sql.VarChar(255), email)
      .query(`
        SELECT UserID, Email, PasswordHash, FirstName, LastName, Role, IsActive, CreatedAt
        FROM Users 
        WHERE Email = @Email AND IsActive = 1
      `);
  }

  static async findById(userId) {
    const pool = await getPool();
    return pool.request()
      .input('UserID', sql.Int, userId)
      .query(`
        SELECT UserID, Email, FirstName, LastName, Role, IsActive, CreatedAt
        FROM Users 
        WHERE UserID = @UserID AND IsActive = 1
      `);
  }

  static async create(userData) {
    const { email, password, firstName, lastName, role = 'user' } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const pool = await getPool();
    return pool.request()
      .input('Email', sql.VarChar(255), email)
      .input('PasswordHash', sql.VarChar(255), hashedPassword)
      .input('FirstName', sql.VarChar(100), firstName)
      .input('LastName', sql.VarChar(100), lastName)
      .input('Role', sql.VarChar(50), role)
      .query(`
        INSERT INTO Users (Email, PasswordHash, FirstName, LastName, Role, IsActive, CreatedAt)
        OUTPUT INSERTED.UserID, INSERTED.Email, INSERTED.FirstName, INSERTED.LastName, INSERTED.Role
        VALUES (@Email, @PasswordHash, @FirstName, @LastName, @Role, 1, GETDATE())
      `);
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLastLogin(userId) {
    const pool = await getPool();
    return pool.request()
      .input('UserID', sql.Int, userId)
      .query(`
        UPDATE Users 
        SET LastLoginAt = GETDATE() 
        WHERE UserID = @UserID
      `);
  }

  static async getRolePermissions(role) {
    const permissions = {
      'admin': [
        'client:read', 'client:write', 'client:delete',
        'employee:read', 'employee:write', 'employee:delete',
        'vehicle:read', 'vehicle:write', 'vehicle:delete',
        'invoice:read', 'invoice:write', 'invoice:delete',
        'payslip:read', 'payslip:write',
        'inspection:read', 'inspection:write',
        'user:manage'
      ],
      'manager': [
        'client:read', 'client:write',
        'employee:read', 'employee:write',
        'vehicle:read', 'vehicle:write',
        'invoice:read', 'invoice:write',
        'payslip:read', 'payslip:write',
        'inspection:read', 'inspection:write'
      ],
      'user': [
        'client:read',
        'employee:read',
        'vehicle:read',
        'invoice:read',
        'payslip:read',
        'inspection:read'
      ]
    };

    return permissions[role] || permissions['user'];
  }

  static async findAll() {
    const pool = await getPool();
    const result = await pool.request()
      .query(`
        SELECT UserID, Email, FirstName, LastName, Role, IsActive, CreatedAt, LastLoginAt
        FROM Users 
        ORDER BY CreatedAt DESC
      `);
    
    return result.recordset;
  }

  static async updateById(id, userData) {
    const { firstName, lastName, email, role, isActive } = userData;
    
    const pool = await getPool();
    const result = await pool.request()
      .input('UserID', sql.Int, id)
      .input('Email', sql.VarChar(255), email)
      .input('FirstName', sql.VarChar(100), firstName)
      .input('LastName', sql.VarChar(100), lastName)
      .input('Role', sql.VarChar(50), role)
      .input('IsActive', sql.Bit, isActive !== undefined ? isActive : true)
      .query(`
        UPDATE Users 
        SET Email = @Email, FirstName = @FirstName, LastName = @LastName, 
            Role = @Role, IsActive = @IsActive
        OUTPUT INSERTED.*
        WHERE UserID = @UserID
      `);
    
    return result.recordset[0];
  }
}

module.exports = User;