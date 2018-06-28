var DAOFactory = require('../DAL/DAOFactory.js');
var SessionService = require('./SessionService.js');

class EditorSessionService extends SessionService {
	async createSession(creatorId, newSession) {
		try {
			const sessionId = await this.SessionDAO.createSessionTransaction(creatorId,newSession,'EDITOR');
			return sessionId;
		}
		catch(err) {
			throw err;
		}
	}

	async addQuestion(UserId, SessionId, Title, Content) {
		try {
			const status = 'UNANSWERED';
			const questionObj = {SessionId, UserId, Title, Content, Status};
			const questionId = await this.SessionDAO.addQuestion(questionObj);
			return questionId;
		}
		catch(err) {
			throw err;
		}
	}

	async getQuestionsOfSession(SessionId) {
		try {
			const result = await this.SessionDAO.getQuestionsOfSession(SessionId, true);
			return result;
		}
		catch(err) {
			throw err;
		}
	}
}

module.exports = EditorSessionService;