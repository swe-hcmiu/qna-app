var DAOFactory = require('../DAL/DAOFactory.js');
var SessionService = require('./SessionService.js');

class UserSessionService extends SessionService {
	async addQuestion(UserId, SessionId, Title, Content) {
		try {
			const session = await this.getSessionById(SessionId);
			const SessionType = session.SessionType;
			const questionObj = {SessionId, UserId, Title, Content};

			switch (SessionType) {
				case 'DEFAULT':
					var Status = 'UNANSWERED';
					break;
				case 'NEEDS_VERIFICATION':
					var Status = 'PENDING';
					break;
			}
			const result = await this.SessionDAO.addQuestion(Object.assign(questionObj,{Status}));
			return result;
		}
		catch(err) {
			throw err;
		}
	}

	async getQuestionsOfSession(SessionId) {
		try {
			const result = await this.SessionDAO.getQuestionsOfSession(SessionId, false);
			return result;
		}
		catch(err) {
			throw err;
		}
	}
}

module.exports = UserSessionService;