var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root"
});

con.connect(function(err) {
  if(err) console.log(err);
  console.log("Connected!");
});
