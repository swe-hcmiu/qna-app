// var mysql = require('promise-mysql');
// var preparedStatements = require('./DAL/preparedStatements');
 
// mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'qasys2'
// }).then(function(conn){
//     // do stuff with conn
//     console.log('OK');
//     conn.end();
// }).catch((err) => {
//   console.log(err);
// });

// var pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'qasys2',
//   connectionLimit: 10
// });

// pool.getConnection().then(function(connection) {
//   console.log('connected');
//   const part1User = {
//     DisplayName: 'duy phan',
//     Provider: 'qna'
//   };

//   connection.query(preparedStatements.insertQuery,['users',part1User]).then((result) => {
//     console.log(result);
//   });
// }).catch(function(err) {
//   done(err);
// });