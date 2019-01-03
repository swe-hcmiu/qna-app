const _ = require('lodash');
const { can } = require('../../config/cancan/cancan-config');
const { AppError } = require('../errors/AppError');

const { User } = require('../users/User');
const { RoleService } = require('../roles/RoleService');
const { Role } = require('../roles/Role');
const { Session } = require('./Session');
const { Question } = require('../questions/Question');
const { SessionStrategy } = require('./SessionStrategy');
const { EditorSessionStrategy } = require('./EditorSessionStrategy');
const { UserSessionStrategy } = require('./UserSessionStrategy');
const appConfig = require('../../config/app/app-config');

class SessionService {
  static async getSessionService(rawSession, rawUser) {
    const session = SessionService.convertObjectToModel(rawSession, Session);
    const user = SessionService.convertObjectToModel(rawUser, User);

    const service = new SessionService();
    service.session = _.cloneDeep(session);

    const userOfService = _.cloneDeep(user);
    service.user = userOfService;

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

      service.roleStrategy = service.getStrategyByRole();

      return service;
    } catch (err) {
      throw err;
    }
  }

  // convert object to Model and validate
  static convertObjectToModel(obj, ObjectModel) {
    let clonedObj = _.cloneDeep(obj);
    if (!(clonedObj instanceof ObjectModel)) {
      clonedObj = ObjectModel.fromJson(obj);
    }
    return clonedObj;
  }

  getStrategyByRole() {
    switch (this.role.role) {
      case 'editor': {
        return new EditorSessionStrategy(this.user, this.session, this.role);
      }
      case 'user': {
        return new UserSessionStrategy(this.user, this.session, this.role);
      }
      default: {
        return null;
      }
    }
  }

  static async createSession(rawSession, rawUser) {
    try {
      const session = SessionService.convertObjectToModel(rawSession, Session);
      const user = SessionService.convertObjectToModel(rawUser, User);

      const recvSession = await SessionStrategy.createSession(session, user);
      return recvSession;
    } catch (err) {
      throw err;
    }
  }

  static async getListOfOpeningSessions() {
    try {
      const listOfOpeningSessions = await SessionStrategy.getListOfOpeningSessions();

      return listOfOpeningSessions;
    } catch (err) {
      throw err;
    }
  }

  static async getListOfClosedSessions() {
    try {
      const listOfClosedSessions = await SessionStrategy.getListOfClosedSessions();

      return listOfClosedSessions;
    } catch (err) {
      throw err;
    }
  }

  static async getSessionInstance(sessionId) {
    try {
      const session = await SessionStrategy.getSessionInstance(sessionId);
      return session;
    } catch (err) {
      throw err;
    }
  }

  static async getListOfSessions() {
    try {
      const returnObj = await SessionStrategy.getListOfSessions();
      return returnObj;
    } catch (err) {
      throw err;
    }
  }

  async getInfoOfSession() {
    try {
      const result = await this.roleStrategy.getInfoOfSession();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async deleteSession() {
    try {
      await this.roleStrategy.deleteSession();
    } catch (err) {
      throw err;
    }
  }

  async updateSessionStatus(status) {
    try {
      const recvSession = await this.roleStrategy.updateSessionStatus(status);
      return recvSession;
    } catch (err) {
      throw err;
    }
  }

  async getQuestion(rawQuestion) {
    try {
      const question = SessionService.convertObjectToModel(rawQuestion, Question);

      const recvQuestion = await this.roleStrategy.getQuestion(question);
      return recvQuestion;
    } catch (err) {
      throw err;
    }
  }

  async getNewestQuestionsOfSession(cursor = appConfig.defaultCursor,
    limit = appConfig.defaultLimit, pagingDirection = appConfig.defautPagingDirection) {
    try {
      const listOfNewestQuestions = await this.roleStrategy
        .getNewestQuestionsOfSession(cursor, limit, pagingDirection);

      return listOfNewestQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getTopFavoriteQuestionsOfSession(limit = appConfig.topFavoriteDefaultLimit) {
    try {
      const listOfTopFavoriteQuestions = await this.roleStrategy
        .getTopFavoriteQuestionsOfSession(limit);

      return listOfTopFavoriteQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getAnsweredQuestionsOfSession(cursor = appConfig.defaultCursor,
    limit = appConfig.defaultLimit, pagingDirection = appConfig.defautPagingDirection) {
    try {
      const listOfAnsweredQuestions = await this.roleStrategy
        .getAnsweredQuestionsOfSession(cursor, limit, pagingDirection);

      return listOfAnsweredQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getInvalidQuestionsOfSession(cursor = appConfig.defaultCursor,
    limit = appConfig.defaultLimit, pagingDirection = appConfig.defautPagingDirection) {
    try {
      const listOfInvalidQuestions = await this.roleStrategy
        .getInvalidQuestionsOfSession(cursor, limit, pagingDirection);

      return listOfInvalidQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getPendingQuestionsOfSession(cursor = appConfig.defaultCursor,
    limit = appConfig.defaultLimit, pagingDirection = appConfig.defautPagingDirection) {
    try {
      const listOfPendingQuestions = await this.roleStrategy
        .getPendingQuestionsOfSession(cursor, limit, pagingDirection);

      return listOfPendingQuestions;
    } catch (err) {
      throw err;
    }
  }

  async addQuestionToSession(rawQuestion) {
    const question = SessionService.convertObjectToModel(rawQuestion, Question);
    const { session } = this;

    if (can(this.user, 'add', Question, { session })) {
      try {
        const recvQuestion = await this.roleStrategy
          .addQuestionToSession(question);
        return recvQuestion;
      } catch (err) {
        throw err;
      }
    } else if (session.sessionStatus === 'closed') {
      throw new AppError('Session is closed', 403);
    } else {
      throw new AppError('Internal Server Error', 500);
    }
  }

  async getListOfVotedQuestion() {
    try {
      const listOfVotedQuestions = await this.roleStrategy.getListOfVotedQuestion();

      return listOfVotedQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getListOfEditors() {
    try {
      const listOfEditors = await this.roleStrategy.getListOfEditors();

      return listOfEditors;
    } catch (err) {
      throw err;
    }
  }

  async addVoteToQuestion(rawQuestion) {
    const question = SessionService.convertObjectToModel(rawQuestion, Question);

    const questions = await Question.query().where(question);
    if (_.isEmpty(questions) || questions[0].sessionId !== this.session.sessionId) {
      throw new AppError('Not Found', 404);
    }

    const inputQuestion = questions[0];

    const user = _.cloneDeep(this.user);
    await user.$relatedQuery('votings').where({
      questionId: inputQuestion.questionId,
    });

    const { session } = this;

    if (can(user, 'vote', inputQuestion, { session })) {
      try {
        const recvQuestion = await this.roleStrategy.addVoteToQuestion(inputQuestion);
        return recvQuestion;
      } catch (err) {
        throw err;
      }
    } else if (session.sessionStatus === 'closed') {
      throw new AppError('Session is closed', 403);
    } else if (inputQuestion.questionStatus !== 'unanswered' && inputQuestion.questionStatus !== 'pending') {
      throw new AppError('Cannot vote this type of question', 403);
    } else {
      throw new AppError('User has already voted for question', 409);
    }
  }

  async cancelVoteInQuestion(rawQuestion) {
    const question = SessionService.convertObjectToModel(rawQuestion, Question);

    const questions = await Question.query().where(question);
    if (_.isEmpty(questions) || questions[0].sessionId !== this.session.sessionId) {
      throw new AppError('Not Found', 404);
    }

    const inputQuestion = questions[0];

    const user = _.cloneDeep(this.user);
    await user.$relatedQuery('votings').where({
      questionId: inputQuestion.questionId,
    });

    const { session } = this;
    if (can(user, 'unvote', inputQuestion, { session })) {
      try {
        const recvQuestion = await this.roleStrategy.cancelVoteInQuestion(inputQuestion);
        return recvQuestion;
      } catch (err) {
        throw err;
      }
    } else if (session.sessionStatus === 'closed') {
      throw new AppError('Session is closed', 403);
    } else if (inputQuestion.questionStatus !== 'unanswered' && inputQuestion.questionStatus !== 'pending') {
      throw new AppError('Cannot unvote this type of question', 403);
    } else {
      throw new AppError('User has not voted for question', 409);
    }
  }

  async updateQuestionStatus(rawQuestion, status) {
    console.log(rawQuestion);
    const question = SessionService.convertObjectToModel(rawQuestion, Question);

    const questions = await Question.query().where(question);
    if (_.isEmpty(questions) || questions[0].sessionId !== this.session.sessionId) {
      throw new AppError('Not Found', 404);
    }

    const inputQuestion = questions[0];
    const { session } = this;
    if (can(this.role, 'update', inputQuestion, { session })) {
      try {
        const recvQuestion = await this.roleStrategy.updateQuestionStatus(inputQuestion, status);
        return recvQuestion;
      } catch (err) {
        throw err;
      }
    } else if (session.sessionStatus === 'closed') {
      throw new AppError('Session is closed', 403);
    } else {
      throw new AppError('Authorization required', 401);
    }
  }

  async addEditorToSession(rawEditor) {
    const editor = SessionService.convertObjectToModel(rawEditor, User);

    const editors = await User
      .query()
      .where(editor)
      .eager('roles')
      .modifyEager('roles', (builder) => {
        builder.where({ sessionId: this.session.sessionId });
      });
    if (_.isEmpty(editors)) {
      throw new AppError('Not Found', 404);
    }

    const inputEditor = editors[0];

    if (can(this.role, 'add', inputEditor)) {
      try {
        const recvRecord = await this.roleStrategy
          .addEditorToSession(inputEditor);
        return recvRecord;
      } catch (err) {
        throw err;
      }
    } else if (this.role.role === 'user') {
      throw new AppError('Authorization required', 401);
    } else {
      throw new AppError('Editor already belongs to this session', 403);
    }
  }

  async removeEditorFromSession(rawEditor) {
    const editor = SessionService.convertObjectToModel(rawEditor, User);

    const roles = await editor
      .$relatedQuery('roles')
      .where({
        sessionId: this.session.sessionId,
      });
    if (_.isEmpty(roles)) {
      throw new AppError('Not Found', 404);
    }
    const role = roles[0];

    if (can(this.role, 'remove', role)) {
      try {
        const recvRecord = await this.roleStrategy.removeEditorFromSession(editor);
        return recvRecord;
      } catch (err) {
        throw err;
      }
    } else if (this.role.role === 'user') {
      throw new AppError('Authorization required', 401);
    } else {
      throw new AppError('Internal Server Error', 500);
    }
  }
}

module.exports = {
  SessionService,
};
