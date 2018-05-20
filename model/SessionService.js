var DAOFactory = require('../model/DAOFactory.js');

class SessionService {
	constructor() {
		var mysqlDAOFactory = DAOFactory.getDAOFactory(1);
		this.SessionDAO = mysqlDAOFactory.getSessionDAO();
	}

	createSession(creatorId, newSession, callback) {

		console.log("creatorId", creatorId);

		this.SessionDAO.createSession(newSession, (err, sessionId) => {
			if (err) throw err;

			this.assignEditor(creatorId, sessionId, (err, result) => {
				if (err) throw err;
				console.log(result);
				callback(null, sessionId);
			});
		});
	}

	assignEditor(editorId, sessionId, callback) {

		let editor_session = {EditorId: editorId, 
							SessionId: sessionId};

		this.SessionDAO.assignEditor(editor_session, (err, result) => {
			if (err) throw err;
			callback(null, result);
		});
	}


	getSessionById(sessionId, callback) {
		this.SessionDAO.getSessionById(sessionId, (err, result) => {
			if (err) throw err;
			callback(null, result);
		})
	}

}

module.exports = SessionService;