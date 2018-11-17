class EditorStrategy {
  async getSessionById(sessionId) {

  }

  async getInvalidQuestiosOfSession(session) {

  }

  async getPendingQuestionsOfSession(session) {

  }

  async addQuestionToSession(question, session, user) {

  }

  async getQuestionOfSession(question, session) {

  }

  async addVoteToQuestion(question, session, user) {

  }

  async cancleVoteInQuestion(question, session, user) {

  }

  async updateQuestionStatus(question, status, user) {

  }

  async addEditorToSession(session, editor, user) {

  }

  async removeEditorFromSession(session, editor, user) {

  }
}

module.exports = {
  EditorStrategy,
};
