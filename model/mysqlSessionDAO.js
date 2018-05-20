var mysqlDAOFactory = require('../model/mysqlDAOFactory.js');
var preparedStatements = require('./preparedStatements');

class mysqlSessionDAO {
	constructor() {
		var mysqlDAOFactory = require('../model/mysqlDAOFactory.js');
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
			callback(null, result);
		});
	}

	assignEditor(editor_session, callback) {

		this.connection.query(this.mysql.format(preparedStatements.insertQuery, ['Edits', editor_session]), (err, result) => {
			if (err) throw err;
			callback(null, result);
		});
	}

	getEditorsBySessionId(sessionId, callback) {

		this.connection.query(this.mysql.format(preparedStatements.selectQuery, ['EditorId', 'Edits', 'SessionId', sessionId]), (err, result) => {
			if (err) throw err;
			callback(null, result);
		});

	}

	addQuestion(newQuestion, callback) {

		this.connection.query(this.mysql.format(preparedStatements.insertQuery, ['Questions', newQuestion]), (err, result) => {
			if (err) throw err;
			callback(null, result.insertId);
		});
	}
}

module.exports = mysqlSessionDAO;