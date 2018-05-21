var DAOFactory = require('../DAL/DAOFactory.js');
var SessionService = require('./SessionService.js');

class EditorSessionService extends SessionService {

	createSession(creatorId, newSession, callback) {

		console.log("creatorId", creatorId);

		this.SessionDAO.createSession(newSession, (err, sessionId) => {
			if (err) throw err;

			this.assignRole(creatorId, sessionId, 'EDITOR', (err, result) => {
				if (err) throw err;
				console.log(result);
				callback(null, sessionId);
			});
		});
	}

	assignRole(UserId, SessionId, Role, callback) {

		let roleObject = {UserId, SessionId, Role};

		this.SessionDAO.assignRole(roleObject, (err, result) => {
			if (err) throw err;
			callback(null, result);
		});
	}

	addQuestion(UserId, SessionId, Title, Content, callback) {

		let Status = 'UNANSWERED';
		let questionObj = {SessionId, UserId, Title, Content, Status};
		this.SessionDAO.addQuestion(questionObj, (err, questionId) => {
			if (err) throw err;
			callback(null, questionId);
		});

	}

}

module.exports = EditorSessionService;