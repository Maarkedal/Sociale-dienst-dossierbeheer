const Pool = require("pg/lib").Pool;

/*
remove Sample from the name
*/

const pool = new Pool({
  user: "username",
  database: "dbname",
  password: "",
  port: "5432",
  host: "127.0.0.1",
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
