var mysql = require('mysql');
var mysqlUserDAO = require('./mysqlUserDAO');
var mysqlSessionDAO = require('./mysqlSessionDAO');


class mysqlDAOFactory {

	static createConnection() {
		var connection = mysql.createConnection({
			host:'localhost',
			user:'root',
			password:'',
			database:'QASys'
		});
		return connection;
	}

	static getDbInstance() {
		return mysql;
	}

	getUserDAO() {
		return new mysqlUserDAO();
	}
	getSessionDAO() {
		return new mysqlSessionDAO();
	}
}

module.exports = mysqlDAOFactory;
