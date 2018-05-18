var mysql = require('mysql');
var mysqlUserDAO = require('../model/mysqlUserDAO');

class mysqlDAOFactory {
	static createConnection() {
		var connection = mysql.createConnection({
			host:'localhost',
			user:'root',
			password:'',
			database:'loginapp'
		});
		return connection;
	}
	getUserDAO() {
		return new mysqlUserDAO();
	}
}

module.exports = mysqlDAOFactory;
