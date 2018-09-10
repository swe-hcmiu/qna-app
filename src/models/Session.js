const preparedStatements = require('./preparedStatements');
const mysqlConfig = require('../config/mysql-config');

module.exports = {
  async createSessionTransaction(creatorId, newSession, role) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        await connection.beginTransaction();
        const sessionId = await this.createSession(newSession, connection);
        const roleObject = {
          UserId: creatorId,
          SessionId: sessionId,
          Role: role,
        };
        await this.assignRole(roleObject, connection);
        await connection.commit();
        return sessionId;
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async createSession(newSession, connection) {
    try {
      const result = await connection.query(preparedStatements.insertQuery, ['sessions', newSession]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  async assignRole(roleObject, connection) {
    try {
      const result = await connection.query(preparedStatements.insertQuery, ['roles', roleObject]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async getSessionById(id) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.selectAllQuery, ['sessions', 'SessionId', id]);
        return result[0];
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async getRolesBySessionId(sessionId) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.selectAllQuery, ['roles', 'SessionId', sessionId]);
        return result;
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async addQuestion(newQuestion) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.insertQuery, ['questions', newQuestion]);
        return result.insertId;
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async getQuestionsOfSession(SessionId, includingPending) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        let result;
        if (includingPending) {
          result = await connection.query(preparedStatements.selectAllQuery, ['questions', 'SessionId', SessionId]);
        } else {
          result = await connection.query(preparedStatements.selectAllQueryWithTwoConstraints2,
            ['questions', 'SessionId', SessionId, 'Status', 'PENDING']);
        }
        return result;
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async getQuestion(questionId) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.selectAllQuery,
          ['questions', 'QuestionId', questionId]);
        return result[0];
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async addVoteTransaction(questionId, userId, role) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        await connection.beginTransaction();

        const votingObj = { QuestionId: questionId, UserId: userId };
        await connection.query(preparedStatements.insertQuery, ['voting', votingObj]);
        switch (role) {
          case 'USER': {
            await connection.query(preparedStatements.updateUserVoteQuery, ['questions', 'QuestionId', questionId]);
            break;
          }
          case 'EDITOR': {
            await connection.query(preparedStatements.updateEditorVoteQuery, ['questions', 'QuestionId', questionId]);
            break;
          }
          default:
            throw new Error('Role incorrect');
        }
        await connection.commit();
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async cancleVoteTransaction(questionId, userId, role) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        await connection.beginTransaction();
        const result = await connection.query(preparedStatements.selectAllQueryWithTwoConstraints,
          ['voting', 'QuestionId', questionId, 'UserId', userId]);

        if (result[0]) {
          await connection.query(preparedStatements.deleteAllQueryWithTwoConstraints,
            ['voting', 'QuestionId', questionId, 'UserId', userId]);

          switch (role) {
            case 'USER': {
              await connection.query(preparedStatements.cancleUserVoteQuery, ['questions', 'QuestionId', questionId]);
              break;
            }
            case 'EDITOR': {
              await connection.query(preparedStatements.cancleEditorVoteQuery, ['questions', 'QuestionId', questionId]);
              break;
            }
            default:
              throw new Error('Role incorrect');
          }
          await connection.commit();
        } else {
          throw new Error('Not Found');
        }
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },
};
