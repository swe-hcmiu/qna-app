var mysql = require('promise-mysql');
var mysqlUserDAO = require('./mysqlUserDAO');
var mysqlSessionDAO = require('./mysqlSessionDAO');

class mysqlDAOFactory {
	getUserDAO() {
		return new mysqlUserDAO();	
	}

	getSessionDAO() {
		return new mysqlSessionDAO();
	}
}

mysqlDAOFactory.pool = mysql.createPool({
	host:'localhost',
	user:'root',
	password:'',
	database:'qasys2',
	connectionLimit:10
});

module.exports = mysqlDAOFactory;

