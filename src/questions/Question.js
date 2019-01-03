const { Model } = require('../../config/mysql/mysql-config');

class Question extends Model {
  static get tableName() {
    return 'questions';
  }

  static get idColumn() {
    return 'questionId';
  }

  static get relationMappings() {
    const { User } = require('../users/User');
    const { Session } = require('../sessions/Session');
    const { Voting } = require('../votings/Voting');
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'questions.userId',
          to: 'users.userId',
        },
      },
      sessions: {
        relation: Model.BelongsToOneRelation,
        modelClass: Session,
        join: {
          from: 'questions.sessionId',
          to: 'sessions.sessionId',
        },
      },
      votingUsers: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'questions.questionId',
          through: {
            from: 'votings.questionId',
            to: 'votings.userId',
            modelClass: Voting,
          },
          to: 'users.userId',
        },
      },
      votings: {
        relation: Model.HasManyRelation,
        modelClass: Voting,
        join: {
          from: 'questions.questionId',
          to: 'votings.questionId',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        questionId: { type: ['integer', 'string'] },
        sessionId: { type: ['integer', 'string'] },
        userId: { type: ['integer', 'string'] },
        title: { type: 'string', minLength: 6, maxLength: 255 },
        content: { type: 'text', minLength: 6, maxLength: 255 },
        voteByUser: { type: ['integer', 'string'] },
        voteByEditor: { type: ['integer', 'string'] },
        questionStatus: { enum: ['pending', 'unanswered', 'answered', 'invalid'] },
      },
    };
  }
}

module.exports = { Question };
