const Session = require('../models/Session');

module.exports = {
  async addQuestion(UserId, SessionId, Title, Content) {
    try {
      const session = await Session.getSessionById(SessionId);
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
      const questionId = await Session.addQuestion(Object.assign(questionObj, { Status }));
      return questionId;
    } catch (err) {
      throw err;
    }
  },

  async getQuestionsOfSession(SessionId) {
    try {
      const result = await Session.getQuestionsOfSession(SessionId, false);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async getQuestion(questionId) {
    try {
      const question = await Session.getQuestion(questionId);
      if (question.Status !== 'PENDING') return question;
      throw new Error('Authorization required');
    } catch (err) {
      throw err;
    }
  },

  async addVote(questionId, userId) {
    try {
      await this.getQuestion(questionId);
      await Session.addVoteTransaction(questionId, userId, 'USER');
    } catch (err) {
      throw err;
    }
  },

  async cancleVote(questionId, userId) {
    try {
      await Session.cancleVoteTransaction(questionId, userId, 'USER');
    } catch (err) {
      throw err;
    }
  },
};
