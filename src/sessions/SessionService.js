const Session = require('../models/Session');
const UserSessionService = require('./UserSessionService');
const EditorSessionService = require('./EditorSessionService');
const UserService = require('./UserService');

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

  async getListOfSessions() {
    try {
      const listOfSessions = await Session.getListOfSessions();
      return listOfSessions;
    } catch (err) {
      throw err;
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
      const result = await UserService.getRoleOfUserInSession(userId, sessionId);
      const role = result.Role;
      const service = this.getServiceByRole(role);

      const [session, listOfNewestQuestions, listOfTopFavoriteQuestions, listOfAnsweredQuestions] = await Promise.all([
        this.getSessionById(sessionId),
        this.getNewestQuestionsOfSession(sessionId),
        this.getTopFavoriteQuestionsOfSession(sessionId),
        this.getAnsweredQuestionsOfSession(sessionId),
      ]);
      const returnObj = {
        session,
        role,
        listOfNewestQuestions,
        listOfTopFavoriteQuestions,
        listOfAnsweredQuestions,
      };

      try {
        const listOfPendingQuestions = await service.getPendingQuestionsOfSession(sessionId);
        returnObj.listOfPendingQuestions = listOfPendingQuestions;
        const listOfInvalidQuestions = await service.getInvalidQuestionsOfSession(sessionId);
        returnObj.listOfInvalidQuestions = listOfInvalidQuestions;
      } catch (err) {
        // continue regardless error
      }

      return returnObj;
    } catch (err) {
      throw err;
    }
  },

  async getNewestQuestionsOfSession(sessionId) {
    try {
      const listOfNewestQuestions = await Session.getNewestQuestionsOfSession(sessionId);
      return listOfNewestQuestions;
    } catch (err) {
      throw err;
    }
  },

  async getTopFavoriteQuestionsOfSession(sessionId) {
    try {
      const listOfTopFavoriteQuestions = await Session.getTopFavoriteQuestionsOfSession(sessionId);
      return listOfTopFavoriteQuestions;
    } catch (err) {
      throw err;
    }
  },

  async getAnsweredQuestionsOfSession(sessionId) {
    try {
      const listOfAnsweredQuestions = await Session.getAnsweredQuestionsOfSession(sessionId);
      return listOfAnsweredQuestions;
    } catch (err) {
      throw err;
    }
  },

  async getInvalidQuestiosOfSession(sessionId) {
    try {
      const listOfInvalidQuestions = await Session.getInvalidQuestionsOfSession(sessionId);
      return listOfInvalidQuestions;
    } catch (err) {
      throw err;
    }
  },

  async addQuestionByRole(sessionId, userId, question) {
    try {
      const result = await UserService.getRoleOfUserInSession(userId, sessionId);
      const role = result.Role;

      const service = this.getServiceByRole(role);
      // userId = await UserService.validateUserId(userId);
      const questionId = await service.addQuestion(userId, sessionId, question.title,
        question.content);
      return questionId;
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

  async getQuestionByRole(sessionId, questionId, userId) {
    try {
      const result = await UserService.getRoleOfUserInSession(userId, sessionId);
      const role = result.Role;
      const service = this.getServiceByRole(role);

      const question = await service.getQuestion(questionId);
      return question;
    } catch (err) {
      throw err;
    }
  },

  async addVoteByRole(sessionId, questionId, userId, role) {
    try {
      const service = this.getServiceByRole(role);
      await service.addVote(questionId, userId);
    } catch (err) {
      throw err;
    }
  },

  async cancelVoteByRole(sessionId, questionId, userId, role) {
    try {
      const service = this.getServiceByRole(role);
      await service.cancelVote(questionId, userId);
    } catch (err) {
      throw err;
    }
  },

  async getListOfVotedQuestions(sessionId, userId) {
    try {
      const listOfVotedQuestions = await Session.getListOfVotedQuestions(sessionId, userId);
      return { listOfVotedQuestions };
    } catch (err) {
      throw err;
    }
  },

  async getListOfEditors(sessionId) {
    try {
      const listOfEditors = await Session.getListOfEditors(sessionId);
      return listOfEditors;
    } catch (err) {
      throw err;
    }
  },
};
