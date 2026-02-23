// models/Vat.js
const { sql, getPool } = require('../../util/db');

class Vat{
    static async fetchAll(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT *
            FROM VATExamptionReason
            `);
    }

}

module.exports = Vat;