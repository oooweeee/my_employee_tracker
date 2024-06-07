const pool = require("./connection");

class DB {
    constructor() {}

    async query(sql, args = []) {
        const client = await pool.connect();
        try{
            const result = await client.query(sql, args);
            return result;
        } finally {
            client.release();
        }
    }
}
// query to view all employees
findAllEmployees() 
{
    return this.query(`SELECT * FROM employee`);
}