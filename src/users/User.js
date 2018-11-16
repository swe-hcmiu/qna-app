const { Model } = require('../../config/mysql/mysql-config');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'userId';
  }

  static get relationMappings() {
    const { Session } = require('../sessions/Session');
    const { Question } = require('../questions/Question');
    const { Role } = require('../roles/Role');
    const { Voting } = require('../votings/Voting');
    return {
      qnaUsers: {
        relation: Model.HasOneRelation,
        modelClass: QnAUser,
        join: {
          from: 'users.userId',
          to: 'qnausers.userId',
        },
      },
      googleUsers: {
        relation: Model.HasOneRelation,
        modelClass: GoogleUser,
        join: {
          from: 'users.userId',
          to: 'googleusers.userId',
        },
      },
      questionSessions: {
        relation: Model.ManyToManyRelation,
        modelClass: Session,
        join: {
          from: 'users.userId',
          through: {
            from: 'questions.userId',
            to: 'questions.sessionId',
            modelClass: Question,
          },
          to: 'sessions.sessionId',
        },
      },
      roleSessions: {
        relation: Model.ManyToManyRelation,
        modelClass: Session,
        join: {
          from: 'users.userId',
          through: {
            from: 'roles.userId',
            to: 'roles.sessionId',
            modelClass: Role,
            extra: ['role'],
          },
          to: 'sessions.sessionId',
        },
      },
      votingQuestions: {
        relation: Model.ManyToManyRelation,
        modelClass: Question,
        join: {
          from: 'users.userId',
          through: {
            from: 'votings.userId',
            to: 'votings.questionId',
            modelClass: Voting,
          },
          to: 'questions.questionId',
        },
      },
      roles: {
        relation: Model.HasManyRelation,
        modelClass: Role,
        join: {
          from: 'users.userId',
          to: 'roles.userId',
        },
      },
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: 'users.userId',
          to: 'questions.userId',
        },
      },
      votings: {
        relation: Model.HasManyRelation,
        modelClass: Voting,
        join: {
          from: 'users.userId',
          to: 'votings.userId',
        },
      },
    };
  }

  static async createUser(user) {

  }

  static async createQnAUser(user) {

  }

  static async createGoogleUser(user) {

  }

  static async comparePasswordQnAUser(candidatePassword, hash) {

  }
}

class QnAUser extends Model {
  static get tableName() {
    return 'qnausers';
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'qnausers.userId',
          to: 'users.userId',
        },
      },
    };
  }
}

class GoogleUser extends Model {
  static get tableName() {
    return 'googleusers';
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'googleusers.userId',
          to: 'users.userId',
        },
      },
    };
  }
}

module.exports = {
  User,
  QnAUser,
  GoogleUser,
};
