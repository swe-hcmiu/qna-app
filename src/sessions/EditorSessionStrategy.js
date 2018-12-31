const { transaction } = require('objection');
const _ = require('lodash');

const { SessionStrategy } = require('./SessionStrategy');
const { Question } = require('../questions/Question');
const { Model } = require('../../config/mysql/mysql-config');
const { AppError } = require('../errors/AppError');
const appConfig = require('../../config/app/app-config');

class EditorSessionStrategy extends SessionStrategy {
  async getInfoOfSession() {
    try {
      const [
        listOfNewestQuestions,
        listOfTopFavoriteQuestions,
        listOfAnsweredQuestions,
        listOfInvalidQuestions,
        listOfPendingQuestions,
      ] = await Promise.all(
        [
          super.getNewestQuestionsOfSession(),
          super.getTopFavoriteQuestionsOfSession(),
          super.getAnsweredQuestionsOfSession(),
          this.getInvalidQuestionsOfSession(),
          this.getPendingQuestionsOfSession(),
        ],
      );

      const listOfQuestionId = SessionStrategy.getUniqueQuestionIdList(
        listOfNewestQuestions.data, listOfTopFavoriteQuestions.data,
        listOfAnsweredQuestions.data, listOfInvalidQuestions.data, listOfPendingQuestions.data,
      );

      const listOfQuestion = SessionStrategy.getUniqueQuestionList(
        listOfNewestQuestions.data, listOfTopFavoriteQuestions.data,
        listOfAnsweredQuestions.data, listOfInvalidQuestions.data, listOfPendingQuestions.data,
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
        listOfInvalidQuestions,
        listOfPendingQuestions,
      };
      return returnObj;
    } catch (err) {
      throw err;
    }
  }

  async getInvalidQuestionsOfSession(cursor = appConfig.defaultCursor,
    limit = appConfig.defaultLimit, pagingDirection = appConfig.defautPagingDirection) {
    try {
      const {
        comparedOperator,
        orderDirection,
      } = SessionStrategy.getComparedOperator(pagingDirection);

      const clonedSession = _.cloneDeep(this.session);
      const listOfInvalidQuestions = await clonedSession
        .$relatedQuery('questions')
        .where({
          questionStatus: 'invalid',
        })
        .andWhere('uuid', comparedOperator, cursor)
        .orderBy('uuid', orderDirection)
        .limit(limit);

      return SessionStrategy.wrapQuestionListWithPagingCursor(listOfInvalidQuestions);
    } catch (err) {
      throw err;
    }
  }

  async getPendingQuestionsOfSession(cursor = appConfig.defaultCursor,
    limit = appConfig.defaultLimit, pagingDirection = appConfig.defautPagingDirection) {
    try {
      const {
        comparedOperator,
        orderDirection,
      } = SessionStrategy.getComparedOperator(pagingDirection);

      const clonedSession = _.cloneDeep(this.session);
      const listOfPendingQuestions = await clonedSession
        .$relatedQuery('questions')
        .where({
          questionStatus: 'pending',
        })
        .andWhere('uuid', comparedOperator, cursor)
        .orderBy('uuid', orderDirection)
        .limit(limit);

      return SessionStrategy.wrapQuestionListWithPagingCursor(listOfPendingQuestions);
    } catch (err) {
      throw err;
    }
  }

  async getQuestion(question) {
    try {
      const questions = await Question.query().where(question);
      if (_.isEmpty(questions) || questions[0].sessionId !== this.session.sessionId) {
        throw new AppError('Not Found', 404);
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
      inputQuestion.questionStatus = 'unanswered';
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
          .updateAndFetch({ voteByEditor: inputQuestion.voteByEditor + 1 });

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
          .updateAndFetch({ voteByEditor: inputQuestion.voteByEditor - 1 });
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
    try {
      const updateQuestion = await question
        .$query()
        .updateAndFetch({ questionStatus: status });
      return updateQuestion;
    } catch (err) {
      throw err;
    }
  }

  async addEditorToSession(editor) {
    try {
      const assignedEditor = _.cloneDeep(editor);

      await assignedEditor
        .$relatedQuery('roles')
        .insert({ sessionId: this.session.sessionId, role: 'editor' });
      return assignedEditor;
    } catch (err) {
      throw err;
    }
  }

  async removeEditorFromSession(editor) {
    try {
      const removedEditor = _.cloneDeep(editor);
      await removedEditor.$relatedQuery('roles').delete().where({ sessionId: this.session.sessionId });
      const returnEditor = await removedEditor
        .$query()
        .eager('roles')
        .modifyEager('roles', (builder) => {
          builder.where({ sessionId: this.session.sessionId });
        });
      return returnEditor;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  EditorSessionStrategy,
};
