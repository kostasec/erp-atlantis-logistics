// models/DocumentStatus.js
const { sql, getPool } = require('../../util/db');

class DocumentStatus{
    static async fetchAll(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT DStatusID 
            FROM DocumentStatusList 
            `);
    }
}

module.exports = DocumentStatus;