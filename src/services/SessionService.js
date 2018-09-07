const Session = require('../models/Session');
const UserSessionService = require('./UserSessionService');
const EditorSessionService = require('./EditorSessionService');

module.exports = {
  getServiceByRole(role) {
    switch (role) {
      case 'USER': {
        return UserSessionService;
      }
      case 'EDITOR': {
        return EditorSessionService;
      }
      default:
        throw new Error('No role returned');
    }
  },

  async getSessionById(sessionId) {
    try {
      const result = await Session.getSessionById(sessionId);
      return result;
    } catch (err) {
      throw err;
    }
  },
};
