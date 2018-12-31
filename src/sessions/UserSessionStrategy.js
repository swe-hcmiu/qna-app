const { transaction } = require('objection');
const _ = require('lodash');

const { SessionStrategy } = require('./SessionStrategy');
const { Question } = require('../questions/Question');
const { Model } = require('../../config/mysql/mysql-config');
const appConfig = require('../../config/app/app-config');
const { AppError } = require('../errors/AppError');

class UserSessionStrategy extends SessionStrategy {
  async getInfoOfSession() {
    try {
      const [
        listOfNewestQuestions,
        listOfTopFavoriteQuestions,
        listOfAnsweredQuestions,
      ] = await Promise.all(
        [
          super.getNewestQuestionsOfSession(),
          super.getTopFavoriteQuestionsOfSession(),
          super.getAnsweredQuestionsOfSession(),
        ],
      );

      const listOfQuestionId = SessionStrategy.getUniqueQuestionIdList(
        listOfNewestQuestions.data, listOfTopFavoriteQuestions.data,
        listOfAnsweredQuestions.data,
      );

      const listOfQuestion = SessionStrategy.getUniqueQuestionList(
        listOfNewestQuestions.data, listOfTopFavoriteQuestions.data,
        listOfAnsweredQuestions.data,
      );

      const listOfUserVotingQuestionId = await super.getUserVotingQuestionIdList(listOfQuestionId);
      const listOfUserCreateQuestionId = super.getUserCreateQuestionIdList(listOfQuestion);

      const returnObj = {
        session: this.session,
        user: {
          role: this.role,
          listOfUserVotingQuestionId,
          listOfUserCreateQuestionId,
        },
        listOfNewestQuestions,
        listOfTopFavoriteQuestions,
        listOfAnsweredQuestions,
      };
      return returnObj;
    } catch (err) {
      throw err;
    }
  }

  async getInvalidQuestionsOfSession(cursor = appConfig.defaultCursor,
    limit = appConfig.defaultLimit, pagingDirection = appConfig.defautPagingDirection) {
    throw new AppError('Authorization required', 401);
  }

  async getPendingQuestionsOfSession(cursor = appConfig.defaultCursor,
    limit = appConfig.defaultLimit, pagingDirection = appConfig.defautPagingDirection) {
    throw new AppError('Authorization required', 401);
  }

  async getQuestion(question) {
    try {
      const questions = await Question.query().where(question);
      if (_.isEmpty(questions) || questions[0].sessionId !== this.session.sessionId) {
        throw new AppError('Not Found', 404);
      }
      if (questions[0].questionStatus === 'pending' || questions[0].questionStatus === 'invalid') {
        throw new AppError('Authorization required', 401);
      }

      return questions[0];
    } catch (err) {
      throw err;
    }
  }

  async addQuestionToSession(question) {
    try {
      const inputQuestion = _.cloneDeep(question);
      inputQuestion.sessionId = this.session.sessionId;
      inputQuestion.userId = this.user.userId;
      inputQuestion.questionStatus = (this.session.sessionType === 'needs_verification') ? 'pending' : 'unanswered';
      const recvQuestion = await Question.query().insertAndFetch(inputQuestion);
      await recvQuestion.$relatedQuery('users');

      return recvQuestion;
    } catch (err) {
      throw err;
    }
  }

  async addVoteToQuestion(question) {
    try {
      const inputQuestion = _.cloneDeep(question);

      const recvQuestion = await transaction(Question.knex(), async (trx) => {
        const updatedQuestion = await inputQuestion
          .$query(trx)
          .updateAndFetch({ voteByUser: inputQuestion.voteByUser + 1 });

        await this.user.$relatedQuery('votings', trx).insert({ questionId: inputQuestion.questionId });
        return updatedQuestion;
      });

      return recvQuestion;
    } catch (err) {
      throw (err);
    }
  }

  async cancelVoteInQuestion(question) {
    try {
      const inputQuestion = _.cloneDeep(question);

      const recvQuestion = await transaction(Model.knex(), async (trx) => {
        const updatedQuestion = await inputQuestion
          .$query(trx)
          .updateAndFetch({ voteByUser: inputQuestion.voteByUser - 1 });
        await this.user
          .$relatedQuery('votings', trx)
          .delete()
          .where({ questionId: inputQuestion.questionId });
        return updatedQuestion;
      });

      return recvQuestion;
    } catch (err) {
      throw (err);
    }
  }

  async updateQuestionStatus(question, status) {
    throw new AppError('Authorization required', 401);
  }

  async addEditorToSession(editor, session, user) {
    throw new AppError('Authorization required', 401);
  }

  async removeEditorFromSession(editor, session) {
    throw new AppError('Authorization required', 401);
  }
}

module.exports = {
  UserSessionStrategy,
};
