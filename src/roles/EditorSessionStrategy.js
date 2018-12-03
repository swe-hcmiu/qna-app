const { transaction } = require('objection');
const _ = require('lodash');

const { Question } = require('../questions/Question');
const { Session } = require('../sessions/Session');
const { User } = require('../users/User');
const { Voting } = require('../votings/Voting');

class EditorSessionStrategy {
  async getInvalidQuestionsOfSession(session) {

  }

  async getPendingQuestionsOfSession(session) {
    try {
      const listOfPendingQuestions = await session
        .$relatedQuery('questions')
        .where({
          questionStatus: 'pending',
        })
        .orderBy('updatedAt', 'desc');
      return listOfPendingQuestions;
    } catch (err) {
      throw err;
    }
  }

  async addQuestionToSession(question, session, user) {
    try {
      const inputQuestion = _.cloneDeep(question);

      inputQuestion.sessionId = session.sessionId;
      inputQuestion.userId = user.userId;
      inputQuestion.questionStatus = 'unanswered';
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
          .updateAndFetch({ voteByEditor: inputQuestion.voteByEditor + 1 });

        await user.$relatedQuery('votings', trx).insert({ questionId: inputQuestion.questionId });
        return updatedQuestion;
      });

      return recvQuestion;
    } catch (err) {
      throw (err);
    }
  }

  async cancleVoteInQuestion(question, session, user) {

  }

  async updateQuestionStatus(question, status, user) {

  }

  async addEditorToSession(editor, session, user) {

  }

  async removeEditorFromSession(editor, session, user) {

  }
}

module.exports = {
  EditorSessionStrategy,
};
