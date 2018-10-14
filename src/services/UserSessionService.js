const Session = require('../models/Session');

module.exports = {
  async addQuestion(UserId, SessionId, Title, Content) {
    try {
      const session = await Session.getSessionById(SessionId);
      const { SessionType } = session;
      const questionObj = {
        SessionId, UserId, Title, Content,
      };
      let Status;

      switch (SessionType) {
        case 'DEFAULT':
          Status = 'UNANSWERED';
          break;
        case 'NEEDS_VERIFICATION':
          Status = 'PENDING';
          break;
        default:
          return undefined;
      }
      const questionId = await Session.addQuestion(Object.assign(questionObj, { Status }));
      return questionId;
    } catch (err) {
      throw err;
    }
  },

  async getQuestion(questionId) {
    try {
      const question = await Session.getQuestion(questionId);
      if (question.Status !== 'PENDING') return question;

      const err = new Error('Authorization required');
      err.description = { user: 'user must be editor of this session' };
      throw err;
    } catch (err) {
      throw err;
    }
  },

  async addVote(questionId, userId) {
    try {
      await this.getQuestion(questionId);
      await Session.addVoteTransaction(questionId, userId, 'USER');
    } catch (err) {
      throw err;
    }
  },

  async cancelVote(questionId, userId) {
    try {
      await Session.cancelVoteTransaction(questionId, userId, 'USER');
    } catch (err) {
      throw err;
    }
  },

  async addComment(QuestionId, UserId, ParentId, Content) {
    try {
      const commentObj = {
        QuestionId, UserId, ParentId, Content
      };
      const commentId = await Session.addComment(commentObj);
      return commentId;
    } catch (err) {
      throw err;
    }
  },
};
