const Session = require('../models/Session');
const UserSessionService = require('./UserSessionService');
const EditorSessionService = require('./EditorSessionService');
const UserServirce = require('./UserService');

module.exports = {
  getServiceByRole(role) {
    switch (role) {
      case 'USER': {
        return UserSessionService;
      }
      case 'EDITOR': {
        return EditorSessionService;
      }
      default:
        throw new Error('No role returned');
    }
  },

  async getSessionById(sessionId) {
    try {
      const result = await Session.getSessionById(sessionId);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async getInfoSessionByRole(sessionId, userId) {
    try {
      const result = await UserServirce.getRoleOfUserInSession(userId, sessionId);
      const role = result.Role;
      const service = this.getServiceByRole(role);

      const [session, listOfQuestions] = await Promise.all([this.getSessionById(sessionId),
        service.getQuestionsOfSession(sessionId)]);
      const returnObj = { session, listOfQuestions };
      return returnObj;
    } catch (err) {
      throw err;
    }
  },

  async getListOfQuestionsByRole(sessionId, userId) {
    try {
      const result = await UserServirce.getRoleOfUserInSession(userId, sessionId);
      const role = result.Role;
      const service = this.getServiceByRole(role);

      const listOfQuestions = await service.getQuestionsOfSession(sessionId);
      const returnObj = { listOfQuestions };
      return returnObj;
    } catch (err) {
      throw err;
    }
  },

  async checkQuestionInSession(sessionId, questionId) {
    try {
      const question = await Session.getQuestion(questionId);
      const sessionIdTemp = parseInt(sessionId, 10);
      if (question.SessionId !== sessionIdTemp) throw new Error('This question does not belong to this session');
    } catch (err) {
      throw err;
    }
  },

  async addQuestionByRole(sessionId, userId, question) {
    try {
      const result = await UserServirce.getRoleOfUserInSession(userId, sessionId);
      const role = result.Role;

      const service = this.getServiceByRole(role);
      const questionId = await service.addQuestion(userId, sessionId, question.title,
        question.content);
      return questionId;
    } catch (err) {
      throw err;
    }
  },

  async getQuestionByRole(sessionId, questionId, userId) {
    try {
      await this.checkQuestionInSession(sessionId, questionId);

      const result = await UserServirce.getRoleOfUserInSession(userId, sessionId);
      const role = result.Role;
      const service = this.getServiceByRole(role);

      const question = await service.getQuestion(questionId);
      return question;
    } catch (err) {
      throw err;
    }
  },

  async addVoteByRole(sessionId, questionId, userId) {
    try {
      await this.checkQuestionInSession(sessionId, questionId);

      const result = await UserServirce.getRoleOfUserInSession(userId, sessionId);
      const role = result.Role;
      const service = this.getServiceByRole(role);

      await service.addVote(questionId, userId);
    } catch (err) {
      throw err;
    }
  },

  async cancleVoteByRole(sessionId, questionId, userId) {
    try {
      await this.checkQuestionInSession(sessionId, questionId);

      const result = await UserServirce.getRoleOfUserInSession(userId, sessionId);
      const role = result.Role;
      const service = this.getServiceByRole(role);

      await service.cancleVote(questionId, userId);
    } catch (err) {
      throw err;
    }
  },
};
