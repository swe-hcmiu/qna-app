const { Model } = require('../../config/mysql/mysql-config');

class Voting extends Model {
  static get tableName() {
    return 'votings';
  }

  static get idColumn() {
    return ['userId', 'questionId'];
  }

  static get relationMappings() {
    const { User } = require('../users/User');
    const { Question } = require('../questions/Question');
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'votings.userId',
          to: 'users.userId',
        },
      },
      questions: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'votings.questionId',
          to: 'questions.questionId',
        },
      },
    };
  }
}

module.exports = { Voting };
