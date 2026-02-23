const { sql, getPool } = require('../util/db');

class PaySlip{
        static async fetchDriverNames(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT EmplID, FirstName
            FROM Employee
            WHERE EmplType='Driver' AND Status='Active'
            `)
    }

    static async fetchPaySlipRSD(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT *
            FROM vw_PaySlipRSD
            `)
    }

        static async fetchPaySlipEUR(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT *
            FROM vw_PaySlipEUR
            `)
    }

    static async fetchTransactionEUR(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT PaymentID_EUR, AmountEUR, Date, e.FirstName+' '+e.LastName AS 'Employee'
            FROM PaymentEUR p
            JOIN Employee e ON p.EmplID = e.EmplID
            `)
    }

    static async fetchTransactionRSD(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT *
            FROM PaymentRSD
            `)
    }    

}

module.exports = PaySlip;