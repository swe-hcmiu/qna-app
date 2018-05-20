var mysql = require('mysql');
var mysqlUserDAO = require('../model/mysqlUserDAO');
var mysqlSessionDAO = require('../model/mysqlSessionDAO');


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
