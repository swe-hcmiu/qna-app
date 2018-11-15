const { Model } = require('../../config/mysql/mysql-config');

class Session extends Model {
  static get tableName() {
    return 'sessions';
  }

  static get idColumn() {
    return 'sessionId';
  }

  static get relationMappings() {
    const { User } = require('../users/User');
    const { Role } = require('../roles/Role');
    const { Question } = require('../questions/Question');
    return {
      roleUsers: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'sessions.sessionId',
          through: {
            from: 'roles.sessionId',
            to: 'roles.userId',
            modelClass: Role,
            extra: ['role'],
          },
          to: 'users.userId',
        },
      },
      questionUsers: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'sessions.sessionId',
          through: {
            from: 'questions.sessionId',
            to: 'questions.userId',
            modelClass: Question,
          },
          to: 'users.userId',
        },
      },
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: 'sessions.sessionId',
          to: 'questions.sessionId',
        },
      },
    };
  }
}

module.exports = { Session };
