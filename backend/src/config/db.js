const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: "dbdibujitos.cvqtg3vqsovm.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "pywxuk-baWqoh-bibvu4",
  database: "dbdibujitos",
  connectTimeout: 3600000 
});



module.exports = connection;