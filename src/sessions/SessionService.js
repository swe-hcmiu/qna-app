const { RoleService } = require('../roles/RoleService');

class SessionService {
  static async getSessionService(session, user) {
    this.session = session;
    this.user = user;

    const roles = await session
      .$relatedQuery('roles')
      .where({
        userId: this.user.userId,
      });
    if (roles) [this.role] = roles;
    else this.role = RoleService.getUserRole(this.session, this.user);
    this.roleStrategy(this.role);
  }

  set roleStrategy(role) {
    this.roleStrategy = RoleService.getStrategyByRole(role);
  }

  static async createSession(session, user) {

  }

  static async getListOfOpeningSessions() {

  }

  static async getListOfClosedSessions() {

  }

  async getNewestQuestionsOfSession() {

  }

  async getTopFavoriteQuestionsOfSession() {

  }

  async getAnsweredQuestionsOfSession() {

  }

  async getInvalidQuestiosOfSession() {
    try {
      const listOfInvalidQuestions = await this.roleStrategy.getInvalidQuestiosOfSession(this.session);
      return listOfInvalidQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getPendingQuestionsOfSession() {
    try {
      const listOfPendingQuestions = await this.roleStrategy.getPendingQuestionsOfSession(this.session);
      return listOfPendingQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getListOfVotedQuestion() {

  }

  async getListOfEditors() {

  }

  async addQuestionToSession(question) {
    try {
      await this.roleStrategy.addQuestionToSession(question, this.session, this.user);
    } catch (err) {
      throw err;
    }
  }

  async addVoteToQuestion(question) {
    try {
      await this.roleStrategy.addVoteToQuestion(question, this.session, this.user);
    } catch (err) {
      throw err;
    }
  }

  async cancleVoteInQuestion(question) {
    try {
      await this.roleStrategy.cancleVoteInQuestion(question, this.session, this.user);
    } catch (err) {
      throw err;
    }
  }

  async updateQuestionStatus(question, status) {
    try {
      await this.roleStrategy.updateQuestionStatus(question, status, this.user);
    } catch (err) {
      throw err;
    }
  }

  async addEditorToSession(editor) {
    try {
      await this.roleStrategy.addEditorToSession(editor, this.session, this.user);
    } catch (err) {
      throw err;
    }
  }

  async removeEditorFromSession(editor) {
    try {
      await this.roleStrategy.removeEditorFromSession(editor, this.session, this.user);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  SessionService,
};
