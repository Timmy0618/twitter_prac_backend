const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: process.env.connectionLimit,
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

const query = (sql, values) => {
  return new Promise((reslove, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (error, rows) => {
          if (error) {
            reject(error);
          } else {
            reslove(rows);
          }
          connection.release();
        });
      }
    });
  });
};
module.exports = { query };
