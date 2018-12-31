const { transaction } = require('objection');
const _ = require('lodash');
const { can } = require('../../config/cancan/cancan-config');

const { Session } = require('./Session');
const { Role } = require('../roles/Role');
const { Voting } = require('../votings/Voting');
const { AppError } = require('../errors/AppError');
const appConfig = require('../../config/app/app-config');

class SessionStrategy {
  constructor(user, session, role) {
    this.user = user;
    this.session = session;
    this.role = role;
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
      throw new AppError('User cannot create session', 401);
    }
  }

  async deleteSession() {
    if (can(this.role, 'delete', this.session)) {
      try {
        await Session.query().delete().where(this.session);
      } catch (err) {
        throw err;
      }
    } else {
      throw new AppError('Authorization required', 401);
    }
  }

  async updateSessionStatus(status) {
    if (can(this.role, 'update', this.session)) {
      try {
        const recvSession = await this.session.$query().updateAndFetch({ sessionStatus: status });
        return recvSession;
      } catch (err) {
        throw err;
      }
    } else {
      throw new AppError('Authorization required', 401);
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

  static async getSessionInstance(sessionId) {
    try {
      const sessions = await Session.query().where({ sessionId });
      if (_.isEmpty(sessions)) throw new AppError('Session does not exist', 404);

      return sessions[0];
    } catch (err) {
      throw err;
    }
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

  async getUserVotingQuestionIdList(listOfQuestionId) {
    try {
      const listOfUserVotingQuestion = await Voting
        .query()
        .where('userId', this.user.userId)
        .andWhere('questionId', 'in', listOfQuestionId);

      const listOfUserVotingQuestionId = listOfUserVotingQuestion.map((element) => {
        return { questionId: element.questionId };
      });

      return listOfUserVotingQuestionId;
    } catch (err) {
      throw err;
    }
  }

  getUserCreateQuestionIdList(listOfQuestion) {
    const listOfUserCreateQuestionId = listOfQuestion.filter((element) => {
      return element.userId === this.user.userId;
    }).map((element) => {
      return { questionId: element.questionId };
    });

    return listOfUserCreateQuestionId;
  }

  static getUniqueQuestionIdList(...args) {
    const listOfQuestionId = args.reduce((cumList, curList) => {
      return cumList.concat(_.uniq(curList.map((element) => {
        return element.questionId;
      })).filter((questionId) => {
        return cumList.indexOf(questionId) === -1;
      }));
    }, []);

    return listOfQuestionId;
  }

  static getUniqueQuestionList(...args) {
    const listOfQuestionId = args.reduce((cumList, curList) => {
      return cumList.concat(_.uniqBy(curList, 'questionId').filter((element) => {
        return !_.find(cumList, { questionId: element.questionId });
      }));
    }, []);

    return listOfQuestionId;
  }

  static getComparedOperator(pagingDirection) {
    let comparedOperator;
    let orderDirection;
    switch (pagingDirection) {
      case 'before':
        comparedOperator = '>';
        orderDirection = 'asc';
        break;
      default:
        comparedOperator = '<';
        orderDirection = 'desc';
        break;
    }
    return {
      comparedOperator,
      orderDirection,
    };
  }

  static wrapQuestionListWithPagingCursor(listOfQuestion) {
    const beforeCursor = !_.isEmpty(listOfQuestion) ? listOfQuestion[0].uuid : null;
    const afterCursor = !_.isEmpty(listOfQuestion) ?
      listOfQuestion[listOfQuestion.length - 1].uuid : null;

    return {
      data: listOfQuestion,
      paging: {
        cursors: {
          before: beforeCursor,
          after: afterCursor,
        },
      },
    };
  }

  async getNewestQuestionsOfSession(cursor = appConfig.defaultCursor,
    limit = appConfig.defaultLimit, pagingDirection = appConfig.defautPagingDirection) {
    try {
      const {
        comparedOperator,
        orderDirection,
      } = SessionStrategy.getComparedOperator(pagingDirection);

      const clonedSession = _.cloneDeep(this.session);
      const listOfNewestQuestions = await clonedSession
        .$relatedQuery('questions')
        .where({
          questionStatus: 'unanswered',
        })
        .andWhere('uuid', comparedOperator, cursor)
        .orderBy('uuid', orderDirection)
        .limit(limit);

      return SessionStrategy.wrapQuestionListWithPagingCursor(listOfNewestQuestions);
    } catch (err) {
      throw err;
    }
  }

  async getTopFavoriteQuestionsOfSession(limit = appConfig.topFavoriteDefaultLimit) {
    try {
      const clonedSession = _.cloneDeep(this.session);
      const listOfTopFavoriteQuestions = await clonedSession
        .$relatedQuery('questions')
        .where({
          questionStatus: 'unanswered',
        })
        .orderBy('voteByEditor', 'desc')
        .orderBy('voteByUser', 'desc')
        .orderBy('uuid', 'desc')
        .limit(limit);

      return SessionStrategy.wrapQuestionListWithPagingCursor(listOfTopFavoriteQuestions);
    } catch (err) {
      throw err;
    }
  }

  async getAnsweredQuestionsOfSession(cursor = appConfig.defaultCursor,
    limit = appConfig.defaultLimit, pagingDirection = appConfig.defautPagingDirection) {
    try {
      const {
        comparedOperator,
        orderDirection,
      } = SessionStrategy.getComparedOperator(pagingDirection);

      const clonedSession = _.cloneDeep(this.session);
      const listOfAnsweredQuestions = await clonedSession
        .$relatedQuery('questions')
        .where({
          questionStatus: 'answered',
        })
        .andWhere('uuid', comparedOperator, cursor)
        .orderBy('uuid', orderDirection)
        .limit(limit);

      return SessionStrategy.wrapQuestionListWithPagingCursor(listOfAnsweredQuestions);
    } catch (err) {
      throw err;
    }
  }

  async getListOfVotedQuestion() {
    try {
      const listOfVotedQuestions = await this.user
        .$relatedQuery('votingQuestions')
        .select('questions.questionId')
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
}

module.exports = {
  SessionStrategy,
};
