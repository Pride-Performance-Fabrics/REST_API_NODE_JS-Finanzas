const sql = require('mssql');

const dbSettings = {

    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
   // instanceof: process.env.BDDSERVER,
    //port: 1033,
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

async function connectToDatabase() {
    try {
        const pool = await sql.connect(dbSettings);
        // const result = await pool.request().query('select 1')
        
        return pool;
    } catch (error) {
        console.log('Error conexion base de datos:', error);
    }
}

module.exports = {
    connectToDatabase
}