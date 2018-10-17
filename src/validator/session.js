const Validator = require('validator');
const isEmpty = require('./isEmpty');
const SessionService = require('../services/SessionService');
const UserService = require('../services/UserService');
// const userService = require('../services/UserService');

module.exports = {

  async validateCreateSessionInput(data) {
    const description = [];
    const dataTemp = data;

    dataTemp.sessionName = !isEmpty(dataTemp.sessionName) ? dataTemp.sessionName : '';
    dataTemp.sessionType = !isEmpty(dataTemp.sessionType) ? dataTemp.sessionType : '';

    if (!data.user) {
      description.push({ user: 'user must login to create session' });
      const err = new Error('Authorization required');
      err.description = description;
      throw err;
    }

    if (Validator.isEmpty(dataTemp.sessionName)) {
      description.push({ sessionName: 'Session Name is required!' });
    }


    if (Validator.isEmpty(dataTemp.sessionType)) {
      description.push({ sessionType: 'Session Type is required!' });
    }

    if (dataTemp.sessionType !== 'DEFAULT' && dataTemp.sessionType !== 'NEEDS_VERIFICATION') {
      description.push({ sessionType: 'Wrong session type!' });
    }

    if (!isEmpty(description)) {
      const err = new Error('Invalid input');
      err.description = description;
      throw err;
    }
  },

  async validateSession(sessionId) {
    const description = [];
    let sessionIdTemp = sessionId;
    // console.log(data);
    sessionIdTemp = !isEmpty(sessionIdTemp) ? sessionIdTemp : '';
    if (!Validator.isInt(sessionIdTemp)) {
      description.push({ sessionId: 'session id must be an integer' });
    }

    if (!isEmpty(description)) {
      const err = new Error('Invalid input');
      err.description = description;
      throw err;
    }

    try {
      const session = await SessionService.getSessionById(sessionId);
      if (!session) {
        const err = new Error('Not Found');
        description.push({ session: 'Not Found' });
        err.description = description;
        throw err;
      }
    } catch (err) {
      throw err;
    }
  },

  async validateEditorRole(sessionId, user) {
    const description = [];
    const userId = UserService.getUserId(user);
    const result = await UserService.getRoleOfUserInSession(userId, sessionId);
    const role = result.Role;
    if (role !== 'EDITOR') {
      const err = new Error('Authorization required');
      description.push({ user: 'user must be editor of this session' });
      err.description = description;
      throw err;
    }
  },

  async validateDeleteSession(data) {
    try {
      await this.validateSession(data.sessionId);
      await this.validateEditorRole(data.sessionId, data.user);
    } catch (err) {
      throw err;
    }
  },

  async validateGetPendingQuestions(data) {
    try {
      await this.validateSession(data.sessionId);
      await this.validateEditorRole(data.sessionId, data.user);
    } catch (err) {
      throw err;
    }
  },

  async validateGetInvalidQuestions(data) {
    try {
      await this.validateSession(data.sessionId);
      await this.validateEditorRole(data.sessionId, data.user);
    } catch (err) {
      throw err;
    }
  },

  async validateUserAddQuestions(data) {
    try {
      await this.validateSession(data.sessionId);

      const description = [];

      if (!Validator.isLength(data.title, { min: 6, max: 100 })) {
        description.push({ title: 'title must between 6 and 100 characters' });
      }

      if (!Validator.isLength(data.content, { min: 6, max: 200 })) {
        description.push({ content: 'content must between 6 and 200 characters' });
      }
      if (!isEmpty(description)) {
        const err = new Error('Invalid input');
        err.description = description;
        throw err;
      }
    } catch (err) {
      throw err;
    }
  },

  async validateQuestionBelongToSession(questionId, sessionId) {
    try {
      const question = await SessionService.getQuestion(questionId);
      if ((!question) || (question.SessionId !== parseInt(sessionId, 10))) {
        const err = new Error('Not Found');
        err.description = { question: 'Not Found' };
        throw err;
      }
      return question;
    } catch (err) {
      throw err;
    }
  },

  async validateGetSpecificQuestion(data) {
    try {
      await this.validateSession(data.sessionId);
      const description = [];
      if (!Validator.isInt(data.questionId)) {
        description.push({ questionId: 'question id must be an integer' });
      }
      if (!isEmpty(description)) {
        const err = new Error('Invalid input');
        err.description = description;
        throw err;
      }
      await this.validateQuestionBelongToSession(data.questionId, data.sessionId);
    } catch (err) {
      throw err;
    }
  },

  async validateUserVoteQuestions(data) {
    try {
      await this.validateSession(data.sessionId);
      const description = [];

      if (!Validator.isInt(data.questionId)) {
        description.push({ questionId: 'question id must be an integer' });
      }
      if (!isEmpty(description)) {
        const err = new Error('Invalid input');
        err.description = description;
        throw err;
      }

      const question = await this.validateQuestionBelongToSession(data.questionId, data.sessionId);
      if ((question.Status === 'PENDING' || question.Status === 'INVALID') && data.role === 'USER') {
        const err = new Error('Authorization required');
        err.description = { user: 'user must be editor of this session' };
        throw err;
      }
    } catch (err) {
      throw err;
    }
  },

  async validateUserCancleVoteQuestions(data) {
    try {
      await this.validateSession(data.sessionId);
      const description = [];

      if (!Validator.isInt(data.questionId)) {
        description.push({ questionId: 'question id must be an integer' });
      }
      if (!isEmpty(description)) {
        const err = new Error('Invalid input');
        err.description = description;
        throw err;
      }
      await this.validateQuestionBelongToSession(data.questionId, data.sessionId);
    } catch (err) {
      throw err;
    }
  },

  async validateChangeQuestionStatus(data) {
    try {
      await this.validateSession(data.sessionId);
      const description = [];

      if (!Validator.isInt(data.questionId)) {
        description.push({ questionId: 'question id must be an integer' });
      }
      if (!isEmpty(description)) {
        const err = new Error('Invalid input');
        err.description = description;
        throw err;
      }
      await this.validateQuestionBelongToSession(data.questionId, data.sessionId);

      if (data.role !== 'EDITOR') {
        const err = new Error('Authorization required');
        err.description = { user: 'user must be editor of this session' };
        throw err;
      }

      const listStatus = ['UNANSWERED', 'ANSWERED', 'PENDING', 'INVALID'];
      if (!listStatus.includes(data.status)) {
        const err = new Error('Invalid input');
        err.description = { status: 'question status must be unanswered, answered, pending, or invalid' };
        throw err;
      }
    } catch (err) {
      throw err;
    }
  },

  async validateGivePermissions(data) {
    try {
      await this.validateSession(data.sessionId);
      const description = [];

      if (!Validator.isInt(data.userId)) {
        description.push({ userId: 'user id must be an integer' });
      }
      if (!isEmpty(description)) {
        const err = new Error('Invalid input');
        err.description = description;
        throw err;
      }
      if (data.role !== 'EDITOR') {
        const err = new Error('Authorization required');
        err.description = { user: 'user must be editor of this session' };
        throw err;
      }

      const user = await UserService.getUserById(data.userId);
      if (!user) {
        const err = new Error('Not Found');
        err.description = { user: 'user not exist' };
        throw err;
      }
    } catch (err) {
      throw err;
    }
  },

  async validateUserAddComment(data) {
    try {
      await this.validateGetSpecificQuestion(data);
      if (!isEmpty(data.parentId)) {
        try {
          this.validateGetSpecificQuestion({ sessionId: data.sessionId, questionId: data.parentId });
        } catch (err) {
          err.description = { parentId: err.description };
          throw err;
        }
      }

      const description = [];
      if (!Validator.isLength(data.content, { min: 1, max: 200 })) {
        description.push({ content: 'content must between 1 and 200 characters' });
      }
      if (!isEmpty(description)) {
        const err = new Error('Invalid input');
        err.description = description;
        throw err;
      }
    } catch (err) {
      throw err;
    }
  },

  async validateChangeSessionStatus(data) {
    try {
      await this.validateSession(data.sessionId);
      await this.validateEditorRole(data.sessionId, data.user);

      const listStatus = ['OPENING', 'CLOSED'];
      if (!listStatus.includes(data.status)) {
        const err = new Error('Invalid input');
        err.description = { status: 'session status must be opening or closed' };
        throw err;
      }
    } catch (err) {
      throw err;
    }
  },
};
