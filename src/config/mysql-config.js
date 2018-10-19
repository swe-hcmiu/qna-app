const mysql = require('promise-mysql');

module.exports = {
  pool: mysql.createPool({
    host: 'localhost',
    user: 'root',
    Password: '',
    database: 'qasys2',
    connectionLimit: 10,
  }),
};
