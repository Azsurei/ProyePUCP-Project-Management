const mysql = require('mysql');


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: "3306",
  user: "admin",
  password: process.env.DB_PASSWORD,
  database: "dbdibujitos",
  connectTimeout: 3600000 * 8
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