const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    port: 3306,
    database: process.env.database,
  },
  pool: { min: 0, max: 10 },
});
/**
 * @module knex
 */
module.exports = knex;
