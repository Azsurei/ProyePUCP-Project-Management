require('dotenv').config({ path: './../../.env' });

const mysql = require('mysql');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectTimeout: 3600000*8,
});

const connection = {
  query(sql, values) {
    return new Promise((resolve, reject) => {
      pool.query(sql, values, (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        resolve([results, fields]);
      });
    });
  }
};

module.exports = connection;