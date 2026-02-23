// models/PaymentStatus.js
const { sql, getPool } = require('../../util/db');

class PaymentStatus{
    static async fetchAll(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT PaymentStatusID 
            FROM PaymentStatusList
            `);
    }
}

module.exports = PaymentStatus;