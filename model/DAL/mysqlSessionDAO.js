var mysqlDAOFactory = require('./mysqlDAOFactory.js');
var preparedStatements = require('./preparedStatements');

class mysqlSessionDAO {
	constructor() {
		var mysqlDAOFactory = require('./mysqlDAOFactory.js');
		this.connection = mysqlDAOFactory.createConnection();
		this.mysql = mysqlDAOFactory.getDbInstance();
	}


	createSession(newSession, callback) {

		this.connection.query(this.mysql.format(preparedStatements.insertQuery, ['Sessions', newSession]), (err, result) => {
			if (err) throw err;
			callback(null, result.insertId);
		});

	}

	getSessionById(id, callback) {

		this.connection.query(this.mysql.format(preparedStatements.selectAllQuery, ['Sessions', 'SessionId', id]), (err, result) => {
			if (err) throw err;
			callback(null, result[0]);
		});
	}

	assignRole(roleObject, callback) {

		this.connection.query(this.mysql.format(preparedStatements.insertQuery, ['Roles', roleObject]), (err, result) => {
			if (err) throw err;
			callback(null, result);
		});
	}

	getRolesBySessionId(sessionId, callback) {

		this.connection.query(this.mysql.format(preparedStatements.selectAllQuery, ['Roles', 'SessionId', sessionId]), (err, result) => {
			if (err) throw err;
			callback(null, result);
		});

	}

	addQuestion(newQuestion, callback) {

		console.log(newQuestion);

		this.connection.query(this.mysql.format(preparedStatements.insertQuery, ['Questions', newQuestion]), (err, result) => {
			if (err) throw err;
			callback(null, result.insertId);
		});
	}
}

module.exports = mysqlSessionDAO;