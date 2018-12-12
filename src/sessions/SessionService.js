const { transaction } = require('objection');
const _ = require('lodash');
const { can } = require('../../config/cancan/cancan-config');

const { RoleService } = require('../roles/RoleService');
const { Role } = require('../roles/Role');
const { Session } = require('../sessions/Session');
const { Voting } = require('../votings/Voting');

class SessionService {
  static async getSessionService(session, user) {
    const service = new SessionService();
    service.session = _.cloneDeep(session);
    const userOfService = _.cloneDeep(user);
    service.user = await userOfService
      .$query()
      .eager('[votings, questions]')
      .modifyEager('votings', (builder) => {
        builder.select('questionId');
      })
      .modifyEager('questions', (builder) => {
        builder.select('questionId');
      })
      .select('userId');

    try {
      const roles = await Role
        .query()
        .where({
          userId: service.user.userId,
          sessionId: service.session.sessionId,
        })
        .select('userId', 'sessionId', 'role');
      if (!_.isEmpty(roles)) [service.role] = roles;
      else service.role = RoleService.getUserRole(service.session, service.user);
      service.roleStrategy = RoleService.getStrategyByRole(service.role);
      
      return service;
    } catch (err) {
      throw err;
    }
  }

  static async createSession(session, user) {
    let recvSession = null;
    if (can(user, 'create', session)) {
      try {
        const inputSession = _.cloneDeep(session);

        inputSession.roles = new Role();
        inputSession.roles.role = 'editor';
        inputSession.roles.userId = user.userId;

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
    return recvSession;
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

  static getSessionInstance(sessionId) {
    const returnSession = new Session();
    returnSession.sessionId = sessionId;

    return returnSession;
  }

  async getNewestQuestionsOfSession() {
    try {
      const listOfNewestQuestions = await this.session
        .$relatedQuery('questions')
        .where({
          questionStatus: 'unanswered',
        })
        .orderBy('updatedAt', 'desc');

      return listOfNewestQuestions;
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
      const listOfInvalidQuestions = await this.roleStrategy.getInvalidQuestionsOfSession(this.session);
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
    try {
      const listOfVotedQuestions = await this.user
        .$relatedQuery('votingQuestions')
        .select('votings.questionId')
        .where({
          sessionId: this.session.sessionId,
        });

      return listOfVotedQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getListOfEditors() {
    try {
      const listOfEditors = await this.session
        .$relatedQuery('roleUsers')
        .where({ role: 'editor' });
      return listOfEditors;
    } catch (err) {
      throw err;
    }
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
    if (can(this.user, 'vote', question)) {
      try {
        const recvQuestion = await this.roleStrategy.addVoteToQuestion(question, this.user);
        return recvQuestion;
      } catch (err) {
        throw err;
      }
    }
    return question;
  }

  async cancelVoteInQuestion(question) {
    if (can(this.user, 'unvote', question)) {
      try {
        const recvQuestion = await this.roleStrategy.cancelVoteInQuestion(question, this.user);
        return recvQuestion;
      } catch (err) {
        throw err;
      }
    }
    return question;
  }

  async updateQuestionStatus(question, status) {
    try {
      const recvQuestion = await this.roleStrategy.updateQuestionStatus(question, status, this.user);
      return recvQuestion;
    } catch (err) {
      throw err;
    }
  }

  async addEditorToSession(editor) {
    try {
      const recvRecord = await this.roleStrategy
        .addEditorToSession(editor, this.session);
      return recvRecord;
    } catch (err) {
      throw err;
    }
  }

  async removeEditorFromSession(editor) {
    try {
      const recvRecord = await this.roleStrategy.removeEditorFromSession(editor, this.session);
      return recvRecord;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  SessionService,
};
