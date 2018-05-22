var DAOFactory = require('../DAL/DAOFactory.js');
var SessionService = require('./SessionService.js');

class UserSessionService extends SessionService {

	addQuestion(UserId, SessionId, Title, Content, callback) {

		this.getSessionById(SessionId, (err, result) => {
			if (err) throw err;
			
			let SessionType = result.SessionType;
			let questionObj = {SessionId, UserId, Title, Content};

			switch (SessionType) {
				case 'DEFAULT':
					var Status = 'UNANSWERED';
					break;
				case 'NEEDS_VERIFICATION':
					var Status = 'PENDING';
					break;

			}

			this.SessionDAO.addQuestion(Object.assign(questionObj, {Status}), (err, result) => {
				if (err) throw err;
				callback (null, result);
			});

		});
	}

	getQuestionsOfSession(SessionId, callback) {
		this.SessionDAO.getQuestionsOfSession(SessionId, false, (err, result) => {
			if (err) throw err;
			callback(null, result);
		});
	}

}

module.exports = UserSessionService;