const { Role } = require('./Role');

class RoleService {
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
