const { Model } = require('../../config/mysql/mysql-config');

class Role extends Model {
  static get tableName() {
    return 'roles';
  }

  static get idColumn() {
    return ['userId', 'sessionId', 'role'];
  }

  static get relationMappings() {
    const { User } = require('../users/User');
    const { Session } = require('../sessions/Session');
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'roles.userId',
          to: 'users.userId',
        },
      },
      sessions: {
        relation: Model.BelongsToOneRelation,
        modelClass: Session,
        join: {
          from: 'roles.sessionId',
          to: 'sessions.sessionId',
        },
      },
    };
  }
}

module.exports = { Role };
