const mysql = require('mysql');


const pool = mysql.createPool({
  host: "dbdibujitos.cvqtg3vqsovm.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "pywxuk-baWqoh-bibvu4",
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