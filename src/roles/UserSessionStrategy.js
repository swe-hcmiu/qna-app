class UserSessionStrategy {
  async getInvalidQuestiosOfSession(session) {

  }

  async getPendingQuestionsOfSession(session) {

  }

  async addQuestionToSession(question, session, user) {

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
  UserSessionStrategy,
};
