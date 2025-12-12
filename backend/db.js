// backend/db.js
import mysql from "mysql2";

export const db = mysql.createPool({
    host: "MySQL-8.0",
    user: "root",
    password: "",
    database: "react1",
});