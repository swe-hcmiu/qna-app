const Session = require('../models/Session');

module.exports = {
  async createSession(creatorId, newSession) {
    try {
      const sessionId = await Session.createSessionTransaction(creatorId, newSession, 'EDITOR');
      return sessionId;
    } catch (err) {
      throw err;
    }
  },

  async addQuestion(UserId, SessionId, Title, Content) {
    try {
      const Status = 'UNANSWERED';
      const questionObj = {
        SessionId, UserId, Title, Content, Status,
      };
      const questionId = await Session.addQuestion(questionObj);
      return questionId;
    } catch (err) {
      throw err;
    }
  },

  async getQuestionsOfSession(SessionId) {
    try {
      const result = await Session.getQuestionsOfSession(SessionId, true);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async getQuestion(questionId) {
    try {
      const question = await Session.getQuestion(questionId);
      return question;
    } catch (err) {
      throw err;
    }
  },

  async addVote(questionId, userId) {
    try {
      await Session.addVoteTransaction(questionId, userId, 'EDITOR');
    } catch (err) {
      throw err;
    }
  },

  async cancleVote(questionId, userId) {
    try {
      await Session.cancleVoteTransaction(questionId, userId, 'EDITOR');
    } catch (err) {
      throw err;
    }
  },
};
