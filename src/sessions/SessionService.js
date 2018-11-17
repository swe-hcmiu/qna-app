const { RoleService } = require('../roles/RoleService');

class SessionService {
  roleStrategy;

  set roleStrategy(role) {
    this.roleStrategy = RoleService.getStrategyByRole(role);
  }

  async createSession(session, user) {

  }

  async getListOfOpeningSessions() {

  }

  async getListOfClosedSessions() {

  }

  async getSessionById(sessionId) {
    try {
      const session = await this.roleStrategy.getSessionById(sessionId);
      return session;
    } catch (err) {
      throw err;
    }
  }

  async getNewestQuestionsOfSession(session) {

  }

  async getTopFavoriteQuestionsOfSession(session) {

  }

  async getAnsweredQuestionsOfSession(session) {

  }

  async getInvalidQuestiosOfSession(session) {
    try {
      const listOfInvalidQuestions = await this.roleStrategy.getInvalidQuestiosOfSession(session);
      return listOfInvalidQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getPendingQuestionsOfSession(session) {
    try {
      const listOfPendingQuestions = await this.roleStrategy.getPendingQuestionsOfSession(session);
      return listOfPendingQuestions;
    } catch (err) {
      throw err;
    }
  }

  async addQuestionToSession(question, session, user) {
    try {
      await this.roleStrategy.addQuestionToSession(question, session, user);
    } catch (err) {
      throw err;
    }
  }

  async getQuestionOfSession(question, session) {
    try {
      const recvQuestion = await this.roleStrategy.getQuestionOfSession(question, session);
      return recvQuestion;
    } catch (err) {
      throw err;
    }
  }

  async addVoteToQuestion(question, session, user) {
    try {
      await this.roleStrategy.addVoteToQuestion(question, session, user);
    } catch (err) {
      throw err;
    }
  }

  async cancleVoteInQuestion(question, session, user) {
    try {
      await this.roleStrategy.cancleVoteInQuestion(question, session, user);
    } catch (err) {
      throw err;
    }
  }

  async getListOfVotedQuestion(session, user) {

  }

  async getListOfEditors(session) {

  }

  async updateQuestionStatus(question, status, user) {
    try {
      await this.roleStrategy.updateQuestionStatus(question, status, user);
    } catch (err) {
      throw err;
    }
  }

  async addEditorToSession(session, editor, user) {
    try {
      await this.roleStrategy.addEditorToSession(session, editor, user);
    } catch (err) {
      throw err;
    }
  }

  async removeEditorFromSession(session, editor, user) {
    try {
      await this.roleStrategy.removeEditorFromSession(session, editor, user);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  SessionService,
};
