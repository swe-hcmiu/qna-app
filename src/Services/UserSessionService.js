const SessionService = require('./SessionService.js');

class UserSessionService extends SessionService {
  async addQuestion(UserId, SessionId, Title, Content) {
    try {
      const session = await this.getSessionById(SessionId);
      const { SessionType } = session;
      const questionObj = {
        SessionId, UserId, Title, Content,
      };
      let Status;

      switch (SessionType) {
        case 'DEFAULT':
          Status = 'UNANSWERED';
          break;
        case 'NEEDS_VERIFICATION':
          Status = 'PENDING';
          break;
        default:
          return undefined;
      }
      const result = await this.SessionDAO.addQuestion(Object.assign(questionObj, { Status }));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getQuestionsOfSession(SessionId) {
    try {
      const result = await this.SessionDAO.getQuestionsOfSession(SessionId, false);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserSessionService;
