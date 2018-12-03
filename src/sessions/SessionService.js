const { transaction } = require('objection');
const _ = require('lodash');

const { RoleService } = require('../roles/RoleService');
const { Role } = require('../roles/Role');
const { Session } = require('../sessions/Session');

class SessionService {
  static async getSessionService(session, user) {
    const service = new SessionService();
    service.session = _.cloneDeep(session);
    service.user = _.cloneDeep(user);

    try {
      const roles = await service.session
        .$relatedQuery('roles')
        .where({
          userId: service.user.userId,
        });
      if (!_.isEmpty(roles)) [service.role] = roles;
      else service.role = RoleService.getUserRole(service.session, service.user);
      service.roleStrategy = RoleService.getStrategyByRole(service.role);

      return service;
    } catch (err) {
      throw err;
    }
  }

  static async createSession(session, user) {
    try {
      const inputSession = _.cloneDeep(session);

      inputSession.roles = new Role();
      inputSession.roles.role = 'editor';
      inputSession.roles.userId = user.userId;

      let recvSession;
      await transaction(Session.knex(), async (trx) => {
        recvSession = await Session
          .query(trx)
          .insertGraphAndFetch(inputSession);
      });

      return recvSession;
    } catch (err) {
      throw err;
    }
  }

  static async getListOfOpeningSessions() {
    try {
      const listOfOpeningSessions = Session
        .query()
        .where({
          sessionStatus: 'opening',
        });

      return listOfOpeningSessions;
    } catch (err) {
      throw err;
    }
  }

  static async getListOfClosedSessions() {
    try {
      const listOfClosedSessions = Session
        .query()
        .where({
          sessionStatus: 'closed',
        });

      return listOfClosedSessions;
    } catch (err) {
      throw err;
    }
  }

  async getNewestQuestionsOfSession() {
    try {
      const listOfOpeningSessions = await this.session
        .$relatedQuery('questions')
        .where({
          questionStatus: 'unanswered',
        })
        .orderBy('updatedAt', 'desc');

      return listOfOpeningSessions;
    } catch (err) {
      throw err;
    }
  }

  async getTopFavoriteQuestionsOfSession() {
    try {
      const listOfTopFavoriteQuestions = await this.session
        .$relatedQuery('questions')
        .where({
          questionStatus: 'unanswered',
        })
        .orderBy('voteByEditor', 'desc')
        .orderBy('voteByUser', 'desc')
        .orderBy('updatedAt', 'desc');

      return listOfTopFavoriteQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getAnsweredQuestionsOfSession() {
    try {
      const listOfAnsweredQuestions = await this.session
        .$relatedQuery('questions')
        .where({
          questionStatus: 'answered',
        })
        .orderBy('updatedAt', 'desc');

      return listOfAnsweredQuestions;
    } catch (err) {
      throw err;
    }
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
      const recvQuestion = await this.roleStrategy.addQuestionToSession(question, this.session, this.user);
      return recvQuestion;
    } catch (err) {
      throw err;
    }
  }

  async addVoteToQuestion(question) {
    try {
      const recvQuestion = await this.roleStrategy.addVoteToQuestion(question, this.user);
      return recvQuestion;
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
