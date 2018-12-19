const { transaction } = require('objection');
const _ = require('lodash');
const { can } = require('../../config/cancan/cancan-config');

const { User } = require('../users/User');
const { RoleService } = require('../roles/RoleService');
const { Role } = require('../roles/Role');
const { Session } = require('../sessions/Session');
const { Question } = require('../questions/Question');

async function getVotingList(session, user) {
  try {
    const result = await User
      .query()
      .joinEager()
      .eager('votings.questions')
      .modifyEager('votings', (builder) => {
        builder.select('questionId');
      })
      .modifyEager('votings.questions', (builder) => {
        builder.select('questionId', 'sessionId');
      })
      .where('users.userId', user.userId)
      .andWhere('votings:questions.sessionId', session.sessionId);

    if (_.isEmpty(result)) return [];

    const votingList = result[0].votings.map((element) => {
      return {
        questionId: element.questionId,
      };
    });
    return votingList;
  } catch (err) {
    throw err;
  }
}

async function getQuestionList(session, user) {
  try {
    const result = await user
      .$relatedQuery('questions')
      .where({ sessionId: session.sessionId })
      .select('questionId');

    const questionList = result.map((element) => {
      return {
        questionId: element.questionId,
      };
    });
    return questionList;
  } catch (err) {
    throw err;
  }
}

class SessionService {
  static async getSessionService(session, user) {
    const service = new SessionService();
    service.session = _.cloneDeep(session);
    const userOfService = _.cloneDeep(user);

    service.user = userOfService;

    [service.user.votings, service.user.questions] = await Promise
      .all([getVotingList(service.session, service.user), getQuestionList(service.session, service.user)]);

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
    if (can(user, 'create', session)) {
      try {
        const inputSession = _.cloneDeep(session);
        let recvSession = null;

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
    } else {
      throw new Error('user cannot create session');
    }
  }

  static async getListOfOpeningSessions() {
    try {
      const listOfOpeningSessions = await Session
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
      const listOfClosedSessions = await Session
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

  static async getListOfSessions() {
    try {
      const [listOfOpeningSessions, listOfClosedSessions] = await Promise.all([
        this.getListOfOpeningSessions(),
        this.getListOfClosedSessions(),
      ]);
      const returnObject = {
        listOfOpeningSessions,
        listOfClosedSessions,
      };
      return returnObject;
    } catch (err) {
      throw err;
    }
  }

  async getInfoOfSession() {
    try {
      const { session } = this.session;
      const [listOfNewestQuestions, listOfTopFavoriteQuestions, listOfAnsweredQuestions, listOfInvalidQuestions, listOfPendingQuestions] = await Promise.all([
        this.getNewestQuestionsOfSession(),
        this.getTopFavoriteQuestionsOfSession(),
        this.getAnsweredQuestionsOfSession(),
        this.getInvalidQuestionsOfSession(),
        this.getPendingQuestionsOfSession(),
      ]);
      const returnObj = {
        session,
        listOfNewestQuestions,
        listOfTopFavoriteQuestions,
        listOfAnsweredQuestions,
        listOfInvalidQuestions,
        listOfPendingQuestions,
      };
      return returnObj;
    } catch (err) {
      throw err;
    }
  }
  //TODO add cancan here
  async deleteSession() {
    if (this.role.role === 'editor') {
      try {
        await Session.query().delete().where(this.session);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error('Authorization required');
    }
  }

  // TODO: Return question based on roles
  async getQuestion(question) {
    try {
      const returnQuestions = await Question.query().where(question);

      return returnQuestions[0];
    } catch (err) {
      throw err;
    }
  }
  // TODO add cancan here
  async updateSessionStatus(status) {
    if (this.role.role === 'editor') {
      try {
        const recvSession = await this.session.$query().updateAndFetch({ sessionStatus: status });
        return recvSession;
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error('Authorization required');
    }
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

  async getInvalidQuestionsOfSession() {
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
    const questions = await Question.query().where(question);
    const inputQuestion = questions[0];
    if (can(this.user, 'vote', inputQuestion)) {
      try {
        const recvQuestion = await this.roleStrategy.addVoteToQuestion(inputQuestion, this.user);
        return recvQuestion;
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error('user already voted for question');
    }
    // return question;
  }

  async cancelVoteInQuestion(question) {
    const questions = await Question.query().where(question);
    const inputQuestion = questions[0];
    if (can(this.user, 'unvote', inputQuestion)) {
      try {
        const recvQuestion = await this.roleStrategy.cancelVoteInQuestion(inputQuestion, this.user);
        return recvQuestion;
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error('user has not voted for question');
    }
    // return question;
  }

  // TODO add cancan
  async updateQuestionStatus(question, status) {
    const questions = await Question.query().where(question);
    const inputQuestion = questions[0];
    try {
      const recvQuestion = await this.roleStrategy.updateQuestionStatus(inputQuestion, status);
      return recvQuestion;
    } catch (err) {
      throw err;
    }
  }

  // TODO add cancan
  async addEditorToSession(editor) {
    try {
      const recvRecord = await this.roleStrategy
        .addEditorToSession(editor, this.session);
      return recvRecord || {};
    } catch (err) {
      throw err;
    }
  }

  // TODO add cancan
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
  getVotingList,
  getQuestionList,
};
