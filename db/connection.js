const { Pool } = require("pg");
require("dotenv").config()

const pool = new Pool({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database:"employees",
     
});
module.exports = pool; 
