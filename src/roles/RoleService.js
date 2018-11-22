const { Role } = require('./Role');
const { EditorSessionStrategy } = require('./EditorSessionStrategy');
const { UserSessionStrategy } = require('./UserSessionStrategy');

class RoleService {
  static getStrategyByRole(role) {
    switch (role.role) {
      case 'editor': {
        return new EditorSessionStrategy();
      }
      case 'user': {
        return new UserSessionStrategy();
      }
      default: {
        return null;
      }
    }
  }

  static getUserRole(session, user) {
    const role = new Role();
    role.sessionId = session.sessionId;
    role.userId = user.userId;
    role.role = 'user';
    return role;
  }
}

module.exports = {
  RoleService,
};
