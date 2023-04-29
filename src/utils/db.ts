import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    database: process.env.MYSQL_DBNAME || 'test',
    password: process.env.MYSQL_PASSWORD || 'password',
    user: process.env.MYSQL_USER || 'root',
});

export default db;
