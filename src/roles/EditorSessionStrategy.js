const _ = require('lodash');

const { Question } = require('../questions/Question');
const { Session } = require('../sessions/Session');

class EditorSessionStrategy {
  async getInvalidQuestiosOfSession(session) {

  }

  async getPendingQuestionsOfSession(session) {

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

  async addVoteToQuestion(question, session, user) {

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
