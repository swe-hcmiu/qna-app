const { transaction } = require('objection');
const _ = require('lodash');

const { Question } = require('../questions/Question');
const { Session } = require('../sessions/Session');
const { Voting } = require('../votings/Voting');
const { Model } = require('../../config/mysql/mysql-config');

class UserSessionStrategy {
  async getInvalidQuestionsOfSession(session) {

  }

  async getPendingQuestionsOfSession(session) {

  }

  async addQuestionToSession(question, session, user) {
    try {
      const inputQuestion = _.cloneDeep(question);
      let inputSession = _.cloneDeep(session);
      inputSession = await inputSession.$query().select('sessionType');
  
      inputQuestion.sessionId = session.sessionId;
      inputQuestion.userId = user.userId;
      inputQuestion.questionStatus = (inputSession.sessionType === 'needs_verification') ? 'pending' : 'unanswered';
      const recvQuestion = await Question.query().insertAndFetch(inputQuestion);
      return recvQuestion;
    } catch (err) {
      throw err;
    }
  }

  async addVoteToQuestion(question, user) {
    try {
      const inputQuestion = _.cloneDeep(question);

      const recvQuestion = await transaction(Question.knex(), async (trx) => {
        const updatedQuestion = await inputQuestion
          .$query(trx)
          .updateAndFetch({ voteByUser: inputQuestion.voteByUser + 1 });

        await user.$relatedQuery('votings', trx).insert({ questionId: inputQuestion.questionId });
        return updatedQuestion;
      });

      return recvQuestion;
    } catch (err) {
      throw (err);
    }
  }

  async cancelVoteInQuestion(question, user) {
    try {
      const inputQuestion = _.cloneDeep(question);

      const recvQuestion = await transaction(Model.knex(), async (trx) => {
        const updatedQuestion = await inputQuestion
          .$query(trx)
          .updateAndFetch({ voteByUser: inputQuestion.voteByUser - 1 });
        await user
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

  async updateQuestionStatus(question, status, user) {

  }

  async addEditorToSession(editor, session, user) {

  }

  async removeEditorFromSession(editor, session) {

  }
}

module.exports = {
  UserSessionStrategy,
};