const mysql = require('mysql');
class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: "xxx",
      port: 0000,
      user: "xxx",
      password: "xxx",
      database: "xxx"
    });
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err)
          return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err)
          return reject(err);
        resolve();
      });
    });
  }
}
  module.exports = Database;
