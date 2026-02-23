// models/ProcessingStatus.js
const { sql, getPool } = require('../../util/db');

class ProcessingStatus{
    static async fetchAll(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT ProcessingStatusID 
            FROM ProcessingStatusList 
            `);
    }
}

module.exports = ProcessingStatus;