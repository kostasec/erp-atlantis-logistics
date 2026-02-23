const { sql, getPool } = require('../util/db');

class Inspection{
    static async fetchVehicleInspection(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT *
            FROM vw_VehicleInspection`)
    }

    static async fetchEmployeeInspection(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT *
            FROM vw_EmployeeInspection`
        )
    }

    static async fetchInspectionOther(){
        const pool = await getPool();
        return pool.request().query(`
            SELECT *
            FROM InspectionOther`
        )
    }

}

module.exports = Inspection;